const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getReports, download_last} = require("../controllers/report.js");

router.get("/", getReports);
router.get("/download-last/:chat_id", download_last);

module.exports = router;