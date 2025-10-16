const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getChats,} = require("../controllers/chat.js");

router.get("/", getChats);

module.exports = router;