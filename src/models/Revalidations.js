// models/Revalidation.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Revalidation = sequelize.define(
  "Revalidation",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    final_master_id: { type: DataTypes.INTEGER, allowNull: true },
    agent_id: { type: DataTypes.INTEGER, allowNull: true },
    warehouse_id: { type: DataTypes.INTEGER, allowNull: true },
    client_id: { type: DataTypes.INTEGER, allowNull: true },

    cfdi_type_id: { type: DataTypes.INTEGER, allowNull: true },
    revalidation_payment_type_id: { type: DataTypes.INTEGER, allowNull: true },
    desconsolidation_payment_type_id: { type: DataTypes.INTEGER, allowNull: true },
    freight_payment_type_id: { type: DataTypes.INTEGER, allowNull: true },
    payment_condition_id: { type: DataTypes.INTEGER, allowNull: true },

    account_payment: { type: DataTypes.STRING(255), allowNull: true },
    observations: { type: DataTypes.STRING(2040), allowNull: true },

    due_agent: { type: DataTypes.STRING(255), allowNull: true },
    collect: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "revalidations",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await Revalidation.sync({ alter: true });
    console.log("✅ Tabla 'revalidations' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando Revalidation:", err);
  }
})();

module.exports = Revalidation;
