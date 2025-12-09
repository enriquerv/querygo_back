// models/InvoiceWarehouse.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("./index");

const InvoiceWarehouse = sequelize.define(
  "InvoiceWarehouse",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(255), allowNull: false },
    code: { type: DataTypes.STRING(255), allowNull: false },
    number: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: "invoice_warehouses",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await InvoiceWarehouse.sync({ alter: false });
    //console.log("✅ Tabla 'invoice_warehouses' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando InvoiceWarehouse:", err);
  }
})();

module.exports = InvoiceWarehouse;
