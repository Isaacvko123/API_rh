const { DataTypes } = require('sequelize');
const sequelize = require('../Base_de_Datos/DB.JS');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser "admin", "user", etc.
    defaultValue: 'user',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  freezeTableName: true,
});

module.exports = User;
