const express = require('express');
const EmpleadosController = require('./EmpleadosController');

const router = express.Router();

// Rutas para la tabla Empleados
router.get('/', EmpleadosController.obtenerTodos); // Obtener todos los empleados
router.post('/crear', EmpleadosController.crearEmpleado);

module.exports = router;
