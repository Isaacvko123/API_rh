const express = require('express');
const cors = require('cors');
const loginRoutes = require('../Rutas/Login/Login'); // Ruta al archivo que contiene las rutas
const protectedRoutes = require('../Rutas/Protección/protected'); // Ruta al archivo que contiene las rutas protegidas
const primeraCarga = require('../Rutas/Primera_Ca/Enrutador');
const router = require('../Rutas/Empleados/routerEmpleados');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', loginRoutes); // Todas las rutas se agrupan bajo "/auth"
app.use('/protected', protectedRoutes);
app.use('/api/primeraCarga', primeraCarga);
app.use('/empleados', router);

// Función para iniciar localmente
function Iniciar() {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = { app, Iniciar };
