const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Desactiva logs de SQL en consola
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión con la base de datos establecida.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1); // Detener si falla la conexión
  }
})();

module.exports = sequelize;
