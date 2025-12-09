// models/UserPermission.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("./index");

const UserPermission = sequelize.define(
  "UserPermission",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false },
    menu_module_id: { type: DataTypes.INTEGER, allowNull: false },
    menu_sub_module_id: { type: DataTypes.INTEGER, allowNull: true },
    permission: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "user_permissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

(async () => {
  try {
    await UserPermission.sync({ alter: false });
    //console.log("✅ Tabla 'user_permissions' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando UserPermission:", err);
  }
})();

module.exports = UserPermission;
