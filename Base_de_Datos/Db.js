const { Sequelize } = require('sequelize');
require('dotenv').config();

// Mostrar en consola los valores que se están enviando desde el .env
console.log('Configuración de conexión:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '***' : null, // Oculta la contraseña en la consola
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT || 3306,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,        // Nombre de la base de datos
  process.env.DB_USER,        // Usuario
  process.env.DB_PASSWORD,    // Contraseña
  {
    host: process.env.DB_HOST,    // Host
    port: process.env.DB_PORT || 3306, // Puerto (por defecto 3306)
    dialect: 'mysql',         // Tipo de base de datos
    logging: false,           // Desactiva logs de SQL en consola
    dialectOptions: {
      connectTimeout: 1000,  // Tiempo de espera para la conexión (opcional)
    },
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión con la base de datos establecida.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1); // Termina el proceso si falla la conexión
  }
})();

module.exports = sequelize;
