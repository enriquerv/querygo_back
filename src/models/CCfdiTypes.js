// models/CCfdiType.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("./index");

const CCfdiType = sequelize.define(
  "CCfdiType",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: "c_cfdi_types",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at", 
  }
);

(async () => {
  try {
    await CCfdiType.sync({ alter: false });
    //console.log("✅ Tabla 'c_cfdi_types' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando CCfdiType:", err);
  }
})();

module.exports = CCfdiType;
