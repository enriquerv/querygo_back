// services/dataService.js
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const sequelize = require("../models"); 
/**
 * Ejecuta una query SQL y genera un reporte Excel .xlsx
 * @param {string} sqlQuery
 * @param {number|string} userId
 */
async function executeQueryAndGenerateReport(sqlQuery, userId) {
  try {
    // 1️⃣ Ejecutar la consulta SQL
    const [rows] = await sequelize.query(sqlQuery, { raw: true });

    if (!rows || rows.length === 0) {
      return {
        success: true,
        message: "La consulta no devolvió registros.",
        reportPath: null,
        rows: []
      };
    }

    // 2️⃣ Crear carpeta "/reports" si no existe
    const reportsDir = path.join(__dirname, "..", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

    // 3️⃣ Configurar archivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    // 4️⃣ Encabezados automáticos según columnas de la query
    worksheet.columns = Object.keys(rows[0]).map((col) => ({
      header: col.toUpperCase(),
      key: col,
      width: 20
    }));

    // 5️⃣ Insertar datos
    rows.forEach((row) => worksheet.addRow(row));

    // 6️⃣ Guardar archivo
    const filename = `report_user_${userId}_${Date.now()}.xlsx`;
    const filePath = path.join(reportsDir, filename);

    await workbook.xlsx.writeFile(filePath);

    return {
      success: true,
      message: "Reporte Excel generado correctamente.",
      reportPath: `/reports/${filename}`,
      rows
    };
  } catch (error) {
    console.error("Error en executeQueryAndGenerateReport:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { executeQueryAndGenerateReport };
