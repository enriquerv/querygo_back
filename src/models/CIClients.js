// models/CIClient.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const CIClient = sequelize.define(
  "CIClient",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    nput_semih: { type: DataTypes.STRING(255), allowNull: false },
    select_cp: { type: DataTypes.STRING(255), allowNull: true },
    redit_acount: { type: DataTypes.STRING(255), allowNull: true },
    cfdi: { type: DataTypes.STRING(255), allowNull: true },
    select_client: { type: DataTypes.STRING(255), allowNull: false },
    agent_id: { type: DataTypes.STRING(255), allowNull: false },
    Observaciones: { type: DataTypes.STRING(255), allowNull: true },
    invoice_exit_id: { type: DataTypes.STRING(255), allowNull: false },
    method_payment: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "c_i_clients",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await CIClient.sync({ alter: false });
    //console.log("✅ Tabla 'c_i_clients' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando CIClient:", err);
  }
})();

module.exports = CIClient;
