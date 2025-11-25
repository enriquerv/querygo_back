// models/OtherExitType.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const OtherExitType = sequelize.define(
  "OtherExitType",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: "other_exit_types",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await OtherExitType.sync({ alter: true });
    console.log("✅ Tabla 'other_exit_types' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando OtherExitType:", err);
  }
})();

module.exports = OtherExitType;
