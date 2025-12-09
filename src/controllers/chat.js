
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
const Profile = require('../models/Profile.js');
// Importar la lógica del motor de Query Go (Text-to-SQL y Reportes)
const { generateQueryFromPrompt } = require('../services/openaiService');
const { executeQueryAndGenerateReport } = require('../services/dataServices');
const { DB_SCHEMA } = require('../utils/dbSchema');


// 💡 NOTA: Reemplaza esto con la obtención real del esquema de la base de datos
// Por ahora, usamos el esquema codificado como placeholder

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

    const conv = await Conversation.bulkCreate([
      { chat_id: chatId, role: 'user', content: user_prompt }
    ]);


    // 2. GENERAR QUERY (Text-to-SQL con OpenAI)
    const { query, statusQuery, MessageIA } = await generateQueryFromPrompt(user_prompt, DB_SCHEMA);


    // 3. EJECUTAR QUERY y GENERAR REPORTE
    const { reportPath, reportMessage, success } = await executeQueryAndGenerateReport(query, userId, conv[0].id, chatId);
    console.log("=========================");
    console.log("REPORT DATA")
    console.log("Report Path:", reportPath);
    console.log("Report Message:", reportMessage);
    console.log("=========================");

    // 4. GUARDAR RESPUESTA DE LA IA en la conversación
    // La IA responde con un mensaje de éxito y el path del reporte
    // const assistantResponse = `${MessageQuery}\n\n**Query Generada:**\n${generatedQuery}\n\n**Reporte:**\n${reportPath}`;

    await Conversation.create({
      chat_id: chatId,
      role: 'assistant',
      content: success ? MessageIA : reportMessage,
      report_path: reportPath,
      report_success: success
    });
    

    // await delay(7000); // Pausa la ejecución por 7000 milisegundos (7 segundos)

    // 5. RESPONDER AL CLIENTE
    
    res.status(201).json({
      chatId,
      message: success ? MessageIA : reportMessage,
      report_path: reportPath,
      report_success: success
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
  console.log("ENTRO A LA FUNCION getConversationByChatId");
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
      attributes: ['role', 'content', 'createdAt', 'report_path', 'report_success'],
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

    // 2. Obtener la conversación anterior para que recuerde
    const allConversation = await Conversation.findAll({
      where: { chat_id: chat_id },
      attributes: ['role', 'content', 'createdAt', 'report_path', 'report_success'],
      order: [['createdAt', 'ASC']]
    });
    const allConv = formatConversationHistory(allConversation);
    console.log("===========ALL CONVER==============");
    console.log(allConv);
    console.log("=========================");
    
    // 3. Guardar el nuevo prompt del usuario en la conversación
    const conv = await Conversation.create({ chat_id, role: 'user', content: user_prompt });
    

    // 4. GENERAR QUERY (Text-to-SQL con OpenAI)
    // La lógica es la misma: generar una query basada en el prompt y el esquema
    const { query, statusQuery, MessageIA } = await generateQueryFromPrompt(user_prompt, DB_SCHEMA, allConv);
    console.log("=========================");
    console.log("DATA GENERAL")
    console.log(userId, userId, conv.id, chat_id)
    console.log("=========================");

    // 5. EJECUTAR QUERY y GENERAR REPORTE
    const { reportPath, reportMessage, success  } = await executeQueryAndGenerateReport(query, userId, conv.id, chat_id);
    console.log("=========================");
    console.log("REPORT DATA")
    console.log("Report Path:", reportPath);
    console.log("Report Message:", reportMessage);
    console.log("=========================");

    // 6. GUARDAR RESPUESTA DE LA IA en la conversación
    // const assistantResponse = `${MessageQuery}\n\n**Query Generada:**\n${generatedQuery}\n\n**Reporte:**\n${reportPath}`;

    await Conversation.create({
      chat_id: chat_id,
      role: 'assistant',
      content: success ? MessageIA : reportMessage,
      report_path: reportPath,
      report_success: success
    });

    // 7. Actualizar la marca de tiempo del chat (para orden en la sidebar)
    await chat.update({ updatedAt: new Date() });

    // await delay(7000);

    // 8. RESPONDER AL CLIENTE
    res.status(200).json({
      chatId: chat_id,
      message: success ? MessageIA : reportMessage,
      report_path: reportPath,
      report_success: success
    });

  } catch (error) {
    console.error('❌ Error en continueConversationAndGenerateQuery:', error);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.', detail: error.message });
  }
};


// -------------------------------------------------------------------------
// 5. Convierte un array de objetos de conversación en un string formateado para el prompt de la IA.
// -------------------------------------------------------------------------
function formatConversationHistory(conversations) {
  if (!conversations || conversations.length === 0) {
    return ""; // Devuelve cadena vacía si no hay historial
  }

  // Título que sirve como separador claro para la IA
  let historyString = "\n--- HISTORIAL DE CONVERSACIÓN ANTERIOR ---\n\n";

  conversations.forEach(conv => {
    // Si el rol es 'assistant' y se generó una query exitosa, 
    // incluimos solo la query para ahorrar tokens y dar contexto SQL clave.
    if (conv.role === 'assistant' && conv.report_success === true && conv.report_path) {
        
        // Asume que el 'content' del assistant contiene el mensaje amigable, 
        // y necesitamos saber qué query generó. Si tienes la query guardada aparte, úsala.
        // Para simplificar, asumiremos que la query es el dato más relevante aquí.
        
        // Si tu modelo `Conversation` también almacena la query SQL generada,
        // sería ideal incluirla. (Ej: conv.generated_sql_query)
        
        // Si no tienes la query SQL guardada, solo usa el mensaje del asistente.
        historyString += `[Assistant]: El reporte fue generado exitosamente. Mensaje: ${conv.content}\n`;
        
    } else if (conv.role === 'assistant') {
        // Respuesta del asistente (ej. mensaje amigable, o error)
        historyString += `[Assistant]: ${conv.content}\n`;

    } else if (conv.role === 'user') {
        // Pregunta del usuario
        historyString += `[User]: ${conv.content}\n`;
    }
  });

  historyString += "\n--- FIN DEL HISTORIAL ---\n\n";
  return historyString;
}


module.exports = {
  createNewChatAndGenerateQuery,
  getUserChats,
  getConversationByChatId,
  continueConversationAndGenerateQuery,
};
