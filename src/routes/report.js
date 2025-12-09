const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getReports, download_last, download_find} = require("../controllers/report.js");

router.get("/", getReports);
router.get("/download-last/:chat_id", download_last);
router.get("/download", download_find);

module.exports = router;