// models/Profile.js
const { DataTypes } = require("sequelize");
// Asegúrate de que la ruta a tu conexión (index.js) sea correcta
const {sequelize} = require("./index"); 

const Profile = sequelize.define(
  "Profile", // Nombre del modelo
  {
    id: { 
      type: DataTypes.INTEGER.UNSIGNED, // Tipo para INT UNSIGNED
      autoIncrement: true, 
      primaryKey: true 
    },

    // Campo 'name' con tipo varchar(255)
    name: { 
      type: DataTypes.STRING(255), 
      allowNull: false // Asumimos que el nombre es obligatorio
    },
    
    // NOTA: No es necesario definir created_at, updated_at y deleted_at
    // en la definición de las columnas si usas 'timestamps: true' y 'paranoid: true',
    // ya que Sequelize los añade automáticamente. Solo los definimos en las opciones (tercer argumento).
  },
  {
    tableName: "profiles", // El nombre real de la tabla en la base de datos
    
    // Configuración para usar las columnas de tiempo:
    timestamps: true,
    paranoid: true, // Habilita soft-delete (deletedAt)
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

// Sincronización del modelo con la base de datos (replicando tu estructura)
(async () => {
  try {
    // Si alter: true cambia el schema, alter: false solo crea si no existe
    await Profile.sync({ alter: false }); 
    // console.log("✅ Tabla 'profiles' sincronizada.");
  } catch (err) {
    console.error("❌ Error sincronizando Profile:", err);
  }
})();

module.exports = Profile;