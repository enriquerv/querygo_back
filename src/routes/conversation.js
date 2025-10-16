const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getConversations,} = require("../controllers/conversation.js");

router.get("/", getConversations);

module.exports = router;