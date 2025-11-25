
// Importar modelos de Sequelize
const Chat = require('../models/Chat');
const Conversation = require('../models/Conversation');
const InvoiceFolios = require('../models/InvoiceFolios.js');
const Clients = require('../models/Clients.js');
const FinalMasters = require('../models/FinalMasters.js');
const FinalHouses = require('../models/FinalHouses.js');
const Revalidations = require('../models/Revalidations.js');
const InvoiceExits = require('../models/InvoiceExits.js');
const RevaCancelations = require('../models/RevaCancelations.js');
const CIClients = require('../models/CIClients.js');
const InvoiceCores = require('../models/InvoiceCores.js');
const CheckoutPayments = require('../models/CheckoutPayments.js');
const CPaymentConditions = require('../models/CPaymentConditions.js');
const CPaymentTypes = require('../models/CPaymentTypes.js');
const CCfdiTypes = require('../models/CCfdiTypes.js');
const Agents = require('../models/Agents.js');
const CExitTypes = require('../models/CExitTypes.js');
const OtherExitTypes = require('../models/OtherExitTypes.js');
const InvoiceWarehouses = require('../models/InvoiceWarehouses.js');
const MenuModules = require('../models/MenuModules.js');
const UserPermissions = require('../models/UserPermissions.js');
// Importar la lógica del motor de Query Go (Text-to-SQL y Reportes)
const { generateQueryFromPrompt } = require('../services/openaiService');
const { executeQueryAndGenerateReport } = require('../services/dataServices');


// 💡 NOTA: Reemplaza esto con la obtención real del esquema de la base de datos
// Por ahora, usamos el esquema codificado como placeholder
const TEMP_DB_SCHEMA = `
    Tablas: 
      c_cargo_types (id, name, created_at, updated_at)
      locations (id, name, max_weight, max_vol, created_at, updated_at)
      locations_c_cargo_types (id, location_id, cargo_type_id, created_at, updated_at)
      users (id, no_emp, job, first_name, last_name, email, password, user_type, birthdate, phone, country_id, state_id, city_id, municipality, colony, street, no_ext, no_int, postal_code, rfc, role_id, area_id, is_main_cashier, is_cashier, last_login, is_supervisor, password_at, user_profiles, pass_incidence, created_at, updated_at, deleted_at)
      user_permissions (id, user_id, menu_module_id, menu_sub_module_id, permission, created_at, updated_at)
      menu_modules (id, name) // Estos son los nombres de los permisos, para que cuando se pidan permisos se usen estos nombres legibles
      
      Relaciones: 
      locations_c_cargo_types.location_id -> locations.id
      locations_c_cargo_types.cargo_type_id -> c_cargo_types.id
      user_permissions.user_id -> users.id
      user_permissions.menu_module_id -> menu_modules.id
`;

// Asume que obtienes el userId desde un middleware de autenticación
const DUMMY_USER_ID = 1;

const { succes, error } = require("../utils/handleResponse");

// src/controllers/chat.js (continuación)

// -------------------------------------------------------------------------
// 1. Lógica Principal: Crear Chat, Generar Query, Ejecutar y Reportar
// -------------------------------------------------------------------------
const createNewChatAndGenerateQuery = async (req, res) => {
  const { user_prompt, id } = req.body;
  const userId = id; // Usar req.user.id con authMiddleware
  if (!user_prompt) {
    return res.status(400).json({ error: 'Falta la solicitud del usuario (user_prompt).' });
  }

  try {
    // 1. INICIAR CHAT y guardar el prompt del usuario
    const chat = await Chat.create({ title: user_prompt.substring(0, 50) + '...', user_id: userId });
    const chatId = chat.id;

    await Conversation.bulkCreate([
      { chat_id: chatId, role: 'user', content: user_prompt }
    ]);

    // 2. GENERAR QUERY (Text-to-SQL con OpenAI)
    const { generatedQuery, statusQuery, MessageQuery } = await generateQueryFromPrompt(user_prompt, TEMP_DB_SCHEMA);
    console.log("Generated Query:", generatedQuery);
    console.log("Status Query:", statusQuery);
    console.log("Message Query:", MessageQuery);
    

    // 3. EJECUTAR QUERY y GENERAR REPORTE
    const { reportPath, reportMessage } = await executeQueryAndGenerateReport(generatedQuery, userId);
    console.log("Report Path:", reportPath);
    console.log("Report Message:", reportMessage);

    // 4. GUARDAR RESPUESTA DE LA IA en la conversación
    // La IA responde con un mensaje de éxito y el path del reporte
    const assistantResponse = `He ejecutado la consulta SQL con éxito.\n**Query Generada:** \`\`\`sql\n${generatedQuery}\n\`\`\`\n**Mensaje:** ${reportMessage}\nEl reporte ha sido generado y guardado en: ${reportPath}`;

    await Conversation.create({
      chat_id: chatId,
      role: 'assistant',
      content: assistantResponse
    });

    await delay(7000); // Pausa la ejecución por 7000 milisegundos (7 segundos)

    // 5. RESPONDER AL CLIENTE
    res.status(201).json({
      chatId,
      message: assistantResponse,
      response: assistantResponse,
      reportPath: reportPath
    });

  } catch (error) {
    console.error('❌ Error en createNewChatAndGenerateQuery:', error);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.', detail: error.message });
  }
};


// -------------------------------------------------------------------------
// 2. Obtener Historial de Chats (Sidebar)
// -------------------------------------------------------------------------
const getUserChats = async (req, res) => {
  const userId = req.body.id; // Usar req.user.id con authMiddleware

  try {
    const chats = await Chat.findAll({
      where: { user_id: userId },
      attributes: ['id', 'title', 'user_id', 'createdAt'], // Solo los campos necesarios para la lista
      order: [['updatedAt', 'DESC']]
    });

    res.json(chats);
  } catch (error) {
    console.error('❌ Error al obtener chats:', error);
    res.status(500).json({ error: 'No se pudo cargar el historial de chats.' });
  }
};


// -------------------------------------------------------------------------
// 3. Obtener Conversación Completa
// -------------------------------------------------------------------------
const getConversationByChatId = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.query;
  if (!chatId || !userId) {
    return res.status(400).json({ error: 'Faltan parámetros: chatId y/o userId.' });
  }

  try {
    const chat = await Chat.findOne({ where: { id: chatId, user_id: userId } });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado o no pertenece al usuario.' });
    }

    const conversation = await Conversation.findAll({
      where: { chat_id: chatId },
      attributes: ['role', 'content', 'createdAt'],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      chatTitle: chat.title,
      messages: conversation
    });

  } catch (error) {
    console.error('❌ Error al obtener conversación:', error);
    res.status(500).json({ error: 'No se pudo cargar la conversación.' });
  }
};

// -------------------------------------------------------------------------
// 4. Lógica para Continuar la Conversación (Actualizar/Añadir Mensajes)
// -------------------------------------------------------------------------
const continueConversationAndGenerateQuery = async (req, res) => {
  // El frontend debe enviar el ID del chat y el nuevo prompt del usuario
  const { chat_id, user_prompt, userId } = req.body;

  if (!chat_id || !user_prompt) {
    return res.status(400).json({ error: 'Faltan parámetros: chat_id y/o user_prompt.' });
  }

  try {
    // 1. Verificar si el chat existe y pertenece al usuario (Seguridad)
    const chat = await Chat.findOne({ where: { id: chat_id, user_id: userId } });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado o no autorizado.' });
    }

    // 2. Guardar el nuevo prompt del usuario en la conversación
    await Conversation.create({ chat_id, role: 'user', content: user_prompt });

    // 3. GENERAR QUERY (Text-to-SQL con OpenAI)
    // La lógica es la misma: generar una query basada en el prompt y el esquema
    const { generatedQuery, statusQuery, MessageQuery } = await generateQueryFromPrompt(user_prompt, TEMP_DB_SCHEMA);
    console.log("Generated Query:", generatedQuery);
    console.log("Status Query:", statusQuery);
    console.log("Message Query:", MessageQuery);

    // 4. EJECUTAR QUERY y GENERAR REPORTE
    const { reportPath, reportMessage } = await executeQueryAndGenerateReport(generatedQuery, userId);
    console.log("Report Path:", reportPath);
    console.log("Report Message:", reportMessage);

    // 5. GUARDAR RESPUESTA DE LA IA en la conversación
    const assistantResponse = `He ejecutado la consulta SQL con éxito.\n**Query Generada:** \`\`\`sql\n${generatedQuery}\n\`\`\`\n**Mensaje:** ${reportMessage}\nEl reporte ha sido generado y guardado en: ${reportPath}`;

    await Conversation.create({
      chat_id,
      role: 'assistant',
      content: assistantResponse
    });

    // 6. Actualizar la marca de tiempo del chat (para orden en la sidebar)
    await chat.update({ updatedAt: new Date() });

    await delay(7000);

    // 7. RESPONDER AL CLIENTE
    res.status(200).json({
      chatId: chat_id,
      message: 'Nueva consulta procesada y reporte generado.',
      response: assistantResponse,
      reportPath: reportPath
    });

  } catch (error) {
    console.error('❌ Error en continueConversationAndGenerateQuery:', error);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.', detail: error.message });
  }
};

// Función para crear una pausa (delay)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


module.exports = {
  createNewChatAndGenerateQuery,
  getUserChats,
  getConversationByChatId,
  continueConversationAndGenerateQuery,
};
