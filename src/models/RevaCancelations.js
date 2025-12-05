// models/RevaCancelation.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const RevaCancelation = sequelize.define(
  "RevaCancelation",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    reva_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DOUBLE(8, 2), allowNull: false },

    payment_condition_id: { type: DataTypes.INTEGER, allowNull: false },
    credit_account: { type: DataTypes.STRING(255), allowNull: true },

    c_cfdi_type_id: { type: DataTypes.INTEGER, allowNull: false },
    client_id: { type: DataTypes.INTEGER, allowNull: false },
    agent_id: { type: DataTypes.INTEGER, allowNull: true },
    warehouse_id: { type: DataTypes.INTEGER, allowNull: true },

    c_payment_type_id: { type: DataTypes.INTEGER, allowNull: false },

    observations: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "reva_cancelations",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await RevaCancelation.sync({ alter: false });
    //console.log("✅ Tabla 'reva_cancelations' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando RevaCancelation:", err);
  }
})();

module.exports = RevaCancelation;
