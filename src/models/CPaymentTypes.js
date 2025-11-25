// models/CPaymentType.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const CPaymentType = sequelize.define(
  "CPaymentType",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "c_payment_types",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await CPaymentType.sync({ alter: true });
    console.log("✅ Tabla 'c_payment_types' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando CPaymentType:", err);
  }
})();

module.exports = CPaymentType;
