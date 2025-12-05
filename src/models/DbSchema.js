const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const DbSchema = sequelize.define("DbSchema", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    schema_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    schema_definition: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
    },
}, {
    tableName: "db_schemas",
    timestamps: true,
    paranoid: true,
    deletedAt: "deletedAt",
});

// 🔹 Sincroniza solo este modelo
(async () => {
    try {
        await DbSchema.sync({ alter: false });
        //console.log("✅ Tabla 'dbschemas' sincronizada.");
    } catch (err) {
        console.error("❌ Error sincronizando DbSchema:", err);
    }
})();

module.exports = DbSchema;
