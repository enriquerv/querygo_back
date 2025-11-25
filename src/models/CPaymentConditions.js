// models/CPaymentCondition.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const CPaymentCondition = sequelize.define(
  "CPaymentCondition",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: "c_payment_conditions",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await CPaymentCondition.sync({ alter: true });
    console.log("✅ Tabla 'c_payment_conditions' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando CPaymentCondition:", err);
  }
})();

module.exports = CPaymentCondition;
