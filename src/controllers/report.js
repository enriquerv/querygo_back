const { succes, error } = require("../utils/handleResponse");
const Report = require("../models/Report");
const Conversation = require("../models/Conversation");
const path = require("path");
/**
 * GET USERS
 */
const getReports = async (req, res) => {
  try {
    const users = await Report.findAll();
    succes(res, users, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};

const download_last = async (req, res) => {
  try {
    const { chat_id } = req.params;

    // Buscar el último reporte generado en esa conversación
    const conversation = await Conversation.findOne({
      where: { chat_id: chat_id },
      order: [["createdAt", "DESC"]] // o updated_at, según tu modelo
    });

    let conversation_id = conversation.id -1 

    const lastReport = await Report.findOne({
      where: { conversation_id: conversation_id },
      order: [["createdAt", "DESC"]] 
    });

    if (!lastReport) {
      return res.status(404).json({ error: "No hay reportes para esta conversación." });
    }

    // Convertir la ruta relativa a ruta absoluta
    const absolutePath = path.join(__dirname, "..", lastReport.report_path);

    return res.download(absolutePath); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al descargar el archivo." });
  }
}


module.exports = {
  getReports,
  download_last
};