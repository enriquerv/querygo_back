// models/CExitType.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const CExitType = sequelize.define(
  "CExitType",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "c_exit_types",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await CExitType.sync({ alter: false });
    //console.log("✅ Tabla 'c_exit_types' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando CExitType:", err);
  }
})();

module.exports = CExitType;
