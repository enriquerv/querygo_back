// models/CheckoutPayment.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const CheckoutPayment = sequelize.define(
  "CheckoutPayment",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    checkout_id: { type: DataTypes.INTEGER, allowNull: false },
    invoice_id: { type: DataTypes.INTEGER, allowNull: false },
    invoice_type: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    reference: { type: DataTypes.STRING(255), allowNull: true },
    observations: { type: DataTypes.TEXT, allowNull: true },
    checkout_user_id: { type: DataTypes.INTEGER, allowNull: true },
    main_checkout_user_id: { type: DataTypes.INTEGER, allowNull: true },
    voucher_status: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "checkout_payments",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await CheckoutPayment.sync({ alter: false });
    //console.log("✅ Tabla 'checkout_payments' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando CheckoutPayment:", err);
  }
})();

module.exports = CheckoutPayment;
