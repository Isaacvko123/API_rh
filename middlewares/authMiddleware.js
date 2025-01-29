const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1]; // Extraemos el token después de "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificamos el token
    req.user = decoded; // Adjuntamos el payload del token al request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = verifyToken;
