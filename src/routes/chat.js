const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');

//Ruta principal: Iniciar nuevo chat y enviar el primer mensaje (Text-to-SQL
router.post('/', chatController.createNewChatAndGenerateQuery); 

//Ruta para obtener la lista de todos los chats de un usuario
router.get('/', chatController.getUserChats); 

//Ruta para obtener la conversación completa de un chat específico
router.get('/:chatId', chatController.getConversationByChatId); 

//Ruta para enviar un mensaje dentro de un chat ya existente
router.post('/continue', chatController.continueConversationAndGenerateQuery);

module.exports = router;