const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    number_client: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rfc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    municipality: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    colony: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    payment_account: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    payment_condition: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    prefix: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "clients",
    timestamps: true, // createdAt y updatedAt
    paranoid: true, // deletedAt
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: false,
    dateFormat: "YYYY-MM-DD HH:mm:ss",
  }
);

// 🔹 Sincronizar solo este modelo
(async () => {
  try {
    await Client.sync({ alter: false });
    //console.log("✅ Tabla 'clients' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando Client:", err);
  }
})();

module.exports = Client;
