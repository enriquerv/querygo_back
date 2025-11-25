const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const FinalHouse = sequelize.define(
  "FinalHouse",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    line1: { type: DataTypes.STRING(255), allowNull: true },
    line2: { type: DataTypes.STRING(255), allowNull: true },

    final_master_id: { type: DataTypes.INTEGER, allowNull: true },

    hbs: { type: DataTypes.STRING(255), allowNull: true },

    entry_date: { type: DataTypes.DATE, allowNull: true },

    origin_iata_id: { type: DataTypes.INTEGER, allowNull: true },
    destination_iata_id: { type: DataTypes.INTEGER, allowNull: true },

    pieces: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    total_pieces: { type: DataTypes.INTEGER, allowNull: true },

    weight: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    total_weight: { type: DataTypes.DOUBLE(20, 2), allowNull: true },

    merchandise_type_id: { type: DataTypes.INTEGER, allowNull: true },

    inner_pieces: { type: DataTypes.STRING(255), allowNull: true },

    description: { type: DataTypes.STRING(255), allowNull: true },

    text_description: { type: DataTypes.STRING(255), allowNull: true },

    shipper_id: { type: DataTypes.STRING(255), allowNull: true },

    consignee_id: { type: DataTypes.STRING(255), allowNull: true },

    from_sira: { type: DataTypes.INTEGER, allowNull: true },

    from_skychain: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "final_houses",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    underscored: false,
    dateFormat: "YYYY-MM-DD HH:mm:ss",
  }
);

(async () => {
  try {
    await FinalHouse.sync({ alter: true });
    console.log("✅ Tabla 'final_houses' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando FinalHouse:", err);
  }
})();

module.exports = FinalHouse;
