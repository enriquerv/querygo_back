// models/MenuModule.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("./index");

const MenuModule = sequelize.define(
  "MenuModule",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: "menu_modules",
    timestamps: false, // No timestamps en esta tabla
  }
);

(async () => {
  try {
    await MenuModule.sync({ alter: false });
    //console.log("✅ Tabla 'menu_modules' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando MenuModule:", err);
  }
})();

module.exports = MenuModule;
