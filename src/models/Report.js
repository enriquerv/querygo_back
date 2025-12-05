const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Report = sequelize.define("Report", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    report_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: "reports",
    timestamps: true,
    paranoid: true,
    deletedAt: "deletedAt",
});

// 🔹 Sincroniza solo este modelo
(async () => {
    try {
        await Report.sync({ alter: false });
        //console.log("✅ Tabla 'reports' sincronizada.");
    } catch (err) {
        console.error("❌ Error sincronizando Report:", err);
    }
})();

module.exports = Report;
