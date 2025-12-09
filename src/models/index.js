const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // quita logs de Sequelize
  }
);

// Probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error);
  }
})();


const ia_db = new Sequelize(
  process.env.DB_NAME_IA,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // quita logs de Sequelize
  }
);

// Probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL IA establecida correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar a MySQL IA:", error);
  }
})();

module.exports = {sequelize, ia_db};
