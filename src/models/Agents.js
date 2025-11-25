// models/Agent.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Agent = sequelize.define(
  "Agent",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    code: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: "agents",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await Agent.sync({ alter: true });
    console.log("✅ Tabla 'agents' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando Agent:", err);
  }
})();

module.exports = Agent;
