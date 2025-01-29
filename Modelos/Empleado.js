const { DataTypes } = require('sequelize');
const sequelize = require('../Base_de_Datos/DB.JS');

const Empleado = sequelize.define('Empleado', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  NOMBRE: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  CONTRATO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  PLANTA: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  FECHA_DE_BAJA: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  FECHA_DE_ENTRADA: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  NSS: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  RFC: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  CURP: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  VENCIMIENTO_DE_CONTRATO: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  PERIODO_DE_PAGO: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  SD: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  CANTIDAD_CON_LETRA: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  SDI: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  STATUS: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  DEPARTAMENTO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  PUESTO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ACTIVIDAD: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  PROYECTO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  UBICACION: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  NOMBRE_DEL_JEFE_DIRECTO: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  EMPRESA: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  SINDICALIZADO_CONFIANZA: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  TURNO: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  SEXO: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  LUGAR_DE_NACIMIENTO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  FECHA_DE_NACIMIENTO: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  EDAD: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  NOMBRE_DEL_PADRE: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  NOMBRE_DE_LA_MADRE: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  DIRECCION: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  COLONIA: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  CIUDAD_MUNICIPIO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ESTADO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  CP: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  ESTADO_CIVIL: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  TELEFONO: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  N_TARJETA: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  CTA_BANCARIA: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  CLABE_INTERBANCARIA: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  BANCO: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  REGISTRO_PATRONAL_IMSS: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  CORREO_ELECTRONICO: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  CALZADO: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  TALLA_PLAYERA_CAMISA: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  TALLA_PANTALON: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  TARJETA_DE_VALES: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'empleados',
  timestamps: false,
});

module.exports = Empleado;
