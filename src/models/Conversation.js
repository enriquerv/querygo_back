const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Conversation = sequelize.define("Conversation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
    },
}, {
    tableName: "conversations",
    timestamps: true,
    paranoid: true,
    deletedAt: "deletedAt",
});

// 🔹 Sincroniza solo este modelo
(async () => {
    try {
        await Conversation.sync({ alter: false });
        //console.log("✅ Tabla 'conversations' sincronizada.");
    } catch (err) {
        console.error("❌ Error sincronizando Conversation:", err);
    }
})();

module.exports = Conversation;
