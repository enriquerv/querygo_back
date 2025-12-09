// models/InvoiceCore.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("./index");

const InvoiceCore = sequelize.define(
  "InvoiceCore",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    id_invoice: { type: DataTypes.INTEGER, allowNull: false },
    type_invoice: { type: DataTypes.INTEGER, allowNull: false },
    code: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT("long"), allowNull: false },
    timbrado_flag: { type: DataTypes.INTEGER, allowNull: false },
    contabilizador_flag: { type: DataTypes.INTEGER, allowNull: false },
    sello: { type: DataTypes.TEXT("long"), allowNull: false },
    noCertificado: { type: DataTypes.STRING(255), allowNull: false },
    certificado: { type: DataTypes.TEXT("long"), allowNull: false },
    sello_cfd: { type: DataTypes.TEXT("long"), allowNull: false },
    uuid: { type: DataTypes.STRING(255), allowNull: false },
    fecha_timbrado: { type: DataTypes.STRING(255), allowNull: false },
    sello_sat: { type: DataTypes.TEXT("long"), allowNull: false },
    cancel: { type: DataTypes.INTEGER, allowNull: false },
    canceled_at: { type: DataTypes.DATE, allowNull: true },
    cancel_type_code: { type: DataTypes.INTEGER, allowNull: true },
    referenced_uuid: { type: DataTypes.STRING(255), allowNull: true },
    referenced_folio: { type: DataTypes.INTEGER, allowNull: true },
    reinvoice_code: { type: DataTypes.STRING(255), allowNull: true },
    had_error: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "invoice_cores",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await InvoiceCore.sync({ alter: false });
    //console.log("✅ Tabla 'invoice_cores' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando InvoiceCore:", err);
  }
})();

module.exports = InvoiceCore;
