const { DataTypes } = require("sequelize");
const {sequelize} = require("./index"); // Asegúrate de que esta ruta sea correcta

const InvoiceFolios = sequelize.define("InvoiceFolios", {
    // 🔑 ID: Clave Primaria Auto-incrementable
    id: {
        type: DataTypes.INTEGER.UNSIGNED, // Coincide con int(10) unsigned
        autoIncrement: true,
        primaryKey: true,
    },
    // 🔢 Datos del Folio
    number: {
        type: DataTypes.INTEGER, // Coincide con int(11)
        allowNull: false,
        unique: true, // Key UNI
    },
    // 🔑 Claves Foráneas
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    final_master_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    final_house_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Key YES
    },
    // 📅 Fechas
    date: {
        type: DataTypes.DATE, // Coincide con datetime
        allowNull: false,
    },
    timbered_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    accounted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    // 💵 Campos de Montos
    exchange: {
        type: DataTypes.DOUBLE(20, 4), // Coincide con double(20,4)
        allowNull: false,
    },
    iva: {
        type: DataTypes.DOUBLE(20, 2), // Coincide con double(20,2)
        allowNull: false,
        defaultValue: 0.00,
    },
    total: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    reva: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    desco: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    destiny_charges: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    preves: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    min_charges: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    maneuver: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    custody: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    storage: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    refri: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    frozen: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    extra_service: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    cancel_invoice: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
    },
    // 🌡️ Campos con mayor precisión (asumiendo DOUBLE)
    hum: {
        type: DataTypes.DOUBLE(32, 4), // Coincide con double(32,4)
        allowNull: true,
    },
    rkn: {
        type: DataTypes.DOUBLE(32, 4),
        allowNull: true,
    },
    rap: {
        type: DataTypes.DOUBLE(32, 4),
        allowNull: true,
    },
    temperature_report: {
        type: DataTypes.DOUBLE(32, 4),
        allowNull: true,
    },
    // ⚙️ Otros Campos
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cancel: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    admin_invoice: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    folio_0: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reason: {
        type: DataTypes.TEXT, // Coincide con text
        allowNull: true,
    },
    user_remove_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_available: {
        type: DataTypes.BOOLEAN, // Coincide con tinyint(1)
        allowNull: false,
        defaultValue: 1,
    },
}, {
    // 🛠️ Opciones del Modelo
    tableName: "invoice_folios",
    timestamps: true,
    paranoid: true,
    deletedAt: "deleted_at", // Usando el nombre de la columna que indicaste
    underscored: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    // Nota: dateFormat se maneja mejor en las opciones globales de Sequelize,
    // pero si lo usaste en tu ejemplo, lo mantendríamos en la configuración global.
});

// 🔹 Esto sincroniza SOLO este modelo
(async () => {
    try {
        await InvoiceFolios.sync({ alter: false });
        //console.log("✅ Tabla 'invoice_folios' sincronizada con paranoid y deleted_at.");
    } catch (err) {
        console.error("❌ Error sincronizando InvoiceFolios:", err);
    }
})();

module.exports = InvoiceFolios;