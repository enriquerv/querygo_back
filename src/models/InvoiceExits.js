// models/InvoiceExit.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const InvoiceExit = sequelize.define(
  "InvoiceExit",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    final_master_id: { type: DataTypes.INTEGER, allowNull: true },
    final_house_id: { type: DataTypes.INTEGER, allowNull: true },
    agent_id: { type: DataTypes.INTEGER, allowNull: true },
    invoice_warehouse_id: { type: DataTypes.INTEGER, allowNull: true },
    client_id: { type: DataTypes.INTEGER, allowNull: true },

    payment_account: { type: DataTypes.STRING(255), allowNull: true },

    c_payment_condition_id: { type: DataTypes.INTEGER, allowNull: true },
    c_cfdi_type_id: { type: DataTypes.INTEGER, allowNull: true },
    c_payment_type_id: { type: DataTypes.INTEGER, allowNull: true },

    c_exit_type_id: { type: DataTypes.INTEGER, allowNull: true },
    other_exit_type_id: { type: DataTypes.INTEGER, allowNull: true },

    observations: { type: DataTypes.STRING(2040), allowNull: true },

    custom_value: { type: DataTypes.STRING(255), allowNull: true },
    comercial_value: { type: DataTypes.STRING(255), allowNull: true },

    extraordinary: { type: DataTypes.INTEGER, allowNull: true },
    lift_truck_id: { type: DataTypes.INTEGER, allowNull: true },

    lift_assigned_at: { type: DataTypes.DATE, allowNull: true },
    exit_parciality_id: { type: DataTypes.INTEGER, allowNull: true },

    amount_preve: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_maneuver: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_custody: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_storage: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_merchandise_rec: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_extraordinary: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_refri: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_conge: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_hum: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_rkn: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    amount_rap: { type: DataTypes.DOUBLE(32, 4), allowNull: true },

    subtotal: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    iva: { type: DataTypes.DOUBLE(32, 4), allowNull: true },
    total: { type: DataTypes.DOUBLE(32, 4), allowNull: true },

    exit_date: { type: DataTypes.DATE, allowNull: true },

    start_service: { type: DataTypes.DATE, allowNull: true },
    last_attention: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "invoice_exits",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  try {
    await InvoiceExit.sync({ alter: false });
    //console.log("✅ Tabla 'invoice_exits' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando InvoiceExit:", err);
  }
})();

module.exports = InvoiceExit;
