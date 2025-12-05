// models/User.js
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./index");

const User = sequelize.define(
    "User",
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        // no_emp: { type: DataTypes.STRING, allowNull: true },
        // job: { type: DataTypes.STRING, allowNull: true },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        // user_type: { type: DataTypes.STRING, allowNull: true },
        // birthdate: { type: DataTypes.STRING, allowNull: true },
        // phone: { type: DataTypes.STRING, allowNull: true },

        // country_id: { type: DataTypes.INTEGER, allowNull: true },
        // state_id: { type: DataTypes.INTEGER, allowNull: true },
        // city_id: { type: DataTypes.INTEGER, allowNull: true },
        // municipality: { type: DataTypes.STRING, allowNull: true },
        // colony: { type: DataTypes.STRING, allowNull: true },
        // street: { type: DataTypes.STRING, allowNull: true },
        // no_ext: { type: DataTypes.STRING, allowNull: true },
        // no_int: { type: DataTypes.STRING, allowNull: true },
        // postal_code: { type: DataTypes.STRING, allowNull: true },
        // rfc: { type: DataTypes.STRING, allowNull: true },

        // role_id: { type: DataTypes.INTEGER, allowNull: false },
        // area_id: { type: DataTypes.INTEGER, allowNull: true },
        // is_main_cashier: { type: DataTypes.INTEGER, allowNull: true },
        // is_cashier: { type: DataTypes.INTEGER, allowNull: true },
        // last_login: { type: DataTypes.DATE, allowNull: true },
        // is_supervisor: { type: DataTypes.INTEGER, allowNull: true },

        // password_at: { type: DataTypes.DATE, allowNull: true },
        // user_profiles: { type: DataTypes.STRING, allowNull: true },
        // pass_incidence: { type: DataTypes.STRING, allowNull: true },
    },
    {
        tableName: "users",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        paranoid: true,
        deletedAt: "deletedAt",
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
    }
);

// 🔹 Método para validar password
User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

(async () => {
    try {
        await User.sync({ alter: false });
        //console.log("✅ Tabla 'users' sincronizada.");
    } catch (err) {
        console.error("❌ Error sincronizando User:", err);
    }
})();

module.exports = User;
