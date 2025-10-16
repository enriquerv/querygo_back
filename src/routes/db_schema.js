const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getDbSchemas,} = require("../controllers/db_schema.js");

router.get("/", getDbSchemas);

module.exports = router;