const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const FinalMaster = sequelize.define(
  "FinalMaster",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    awb: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    entry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    origin_iata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    destination_iata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    total_pieces: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    pieces: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    total_weight: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: true,
    },

    weight: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    volume: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    waste: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    merchandise_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    consignee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    extra: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    routing_origin_iata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    routing_origin_airline: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    future_flight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    routing_destination_iata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    routing_destination_airline: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    account_info: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    account_info_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    account_info_info: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    agent_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    street_line: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    agent_account_num: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    agent_account_num1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    agent_account_num2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    observation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    currency: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    charge_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    charge_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    declared_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    customs_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    insurance_amount: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_pieces: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_weight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_tariff: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_weight_collect: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_charge: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_total: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_natural_of_goods: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    rate_natural_of_goods_svc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    prepaid_weight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    due_carrier: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    col_wt: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    col_vc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    col_tx: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    col_oc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    col_ct: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    cer: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    isu_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    isu_origin: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    isu_destination: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    isu_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    cdc_line1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    cdc_line2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    cdc_line3: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    cdc_line4: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    ref_line1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    ref_line2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    ref_line3: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    ref_line4: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    ref_line5: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    sph: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    cor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    ard: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    uld: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    due_total_carrier: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    entry_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    from_sira: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    from_skychain: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "final_masters",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    underscored: false,
    dateFormat: "YYYY-MM-DD HH:mm:ss",
  }
);

// 🔹 Sincronizar SOLO este modelo
(async () => {
  try {
    await FinalMaster.sync({ alter: true });
    console.log("✅ Tabla 'final_masters' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando FinalMaster:", err);
  }
})();

module.exports = FinalMaster;
