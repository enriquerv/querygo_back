const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getReports,} = require("../controllers/report.js");

router.get("/", getReports);

module.exports = router;