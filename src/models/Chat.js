const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Chat = sequelize.define("Chat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "chats",
    timestamps: true,
    paranoid: true,
    deletedAt: "deletedAt",
});

// 🔹 Sincroniza solo este modelo
(async () => {
    try {
        await Chat.sync({ alter: true });
        console.log("✅ Tabla 'chats' sincronizada.");
    } catch (err) {
        console.error("❌ Error sincronizando Chat:", err);
    }
})();

module.exports = Chat;
