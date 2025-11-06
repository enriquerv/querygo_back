
// Importar modelos de Sequelize
const Chat = require('../models/Chat');
const Conversation = require('../models/Conversation');
// Importar la lógica del motor de Query Go (Text-to-SQL y Reportes)
// const { generateQueryFromPrompt } = require('../services/openaiService'); // Tendrás que crear este servicio
// const { executeQueryAndGenerateReport } = require('../services/dataService'); // Tendrás que crear este servicio


// 💡 NOTA: Reemplaza esto con la obtención real del esquema de la base de datos
// Por ahora, usamos el esquema codificado como placeholder
const TEMP_DB_SCHEMA = `
    -- Esquema simplificado para la IA
    -- Tabla: final_masters (id, awb, pieces)
    -- Tabla: invoice_folios (id, final_master_id, total, timbered_at)
`;

// Asume que obtienes el userId desde un middleware de autenticación
const DUMMY_USER_ID = 1;

const { succes, error } = require("../utils/handleResponse");

// src/controllers/chat.js (continuación)

// -------------------------------------------------------------------------
// 1. Lógica Principal: Crear Chat, Generar Query, Ejecutar y Reportar
// -------------------------------------------------------------------------
const createNewChatAndGenerateQuery = async (req, res) => {
  const { user_prompt } = req.body;
  const userId = DUMMY_USER_ID; // Usar req.user.id con authMiddleware

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
    // const generatedQuery = await generateQueryFromPrompt(user_prompt, TEMP_DB_SCHEMA);
    const generatedQuery = "SELECT awb, pieces FROM final_masters WHERE pieces > 10;"; // Placeholder fijo para pruebas

    // 3. EJECUTAR QUERY y GENERAR REPORTE
    // const { reportPath, reportMessage, dataRows } = await executeQueryAndGenerateReport(generatedQuery, userId);
    const reportPath = `/reports/report_${chatId}.pdf`; // Placeholder fijo para pruebas
    const reportMessage = "El reporte ha sido generado correctamente con los datos solicitados."; // Placeholder fijo para pruebas

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
      message: 'Consulta procesada y reporte generado.',
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
  const userId = DUMMY_USER_ID; // Usar req.user.id con authMiddleware

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
  const userId = DUMMY_USER_ID; // Para verificar pertenencia del chat

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
  const { chat_id, user_prompt } = req.body;
  const userId = DUMMY_USER_ID; // Usar req.user.id con authMiddleware

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
    // const generatedQuery = await generateQueryFromPrompt(user_prompt, TEMP_DB_SCHEMA);
    const generatedQuery = "SELECT awb, pieces FROM final_masters WHERE pieces > 10;"; // Placeholder fijo para pruebas

    // 4. EJECUTAR QUERY y GENERAR REPORTE
    // const { reportPath, reportMessage, dataRows } = await executeQueryAndGenerateReport(generatedQuery, userId);
    const reportPath = `/reports/report_${chat_id}.pdf`; // Placeholder fijo para pruebas
    const reportMessage = "El reporte ha sido generado correctamente con los datos solicitados."; // Placeholder fijo para pruebas

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
