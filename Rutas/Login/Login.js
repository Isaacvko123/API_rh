const express = require('express');
const LoginService = require('../Login/loginService');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await LoginService.register(username, password);
    res.status(201).json({ success: true, message: 'Usuario registrado.', user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const tokens = await LoginService.login(username, password);
    res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// Verificar Access Token
router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const result = LoginService.verifyAccessToken(token);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
});

module.exports = router;
