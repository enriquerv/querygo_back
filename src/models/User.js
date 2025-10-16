const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./index");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: "users",
    timestamps: true, // ✅ activa createdAt y updatedAt
    paranoid: true,   // ✅ activa deletedAt
    deletedAt: "deletedAt", // nombre del campo
    underscored: false, // puedes ponerlo en true si quieres snake_case
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed("password")) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

// 🔹 Método para validar password
User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// 🔹 Esto sincroniza SOLO este modelo
(async () => {
    try {
        await User.sync({ alter: true });
        console.log("✅ Tabla 'users' sincronizada con paranoid y deletedAt.");
    } catch (err) {
        console.error("❌ Error sincronizando User:", err);
    }
})();

module.exports = User;
