const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../../Modelos/Usuario');
require('dotenv').config();

class LoginService {
  // Configuración personalizada de Argon2
  static argonOptions = {
    type: argon2.argon2id, // Algoritmo recomendado por OWASP
    memoryCost: 2 ** 16, // 64 MB de memoria
    timeCost: 3, // 3 iteraciones
    parallelism: 4, // Número de hilos
  };

  /**
   * Registrar usuario con validaciones de contraseña seguras.
   */
  static async register(username, password) {
    if (!this.isValidUsername(username)) {
      throw new Error('El nombre de usuario es inválido o ya está en uso.');
    }

    if (!this.isValidPassword(password)) {
      throw new Error('La contraseña no cumple con los requisitos mínimos.');
    }

    const hashedPassword = await argon2.hash(password, this.argonOptions);
    const user = await User.create({ username, password: hashedPassword });

    return user;
  }

  /**
   * Iniciar sesión con generación de JWT seguro.
   */
  static async login(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error('Usuario no encontrado.');

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) throw new Error('Contraseña incorrecta.');

    // Generar access token y refresh token
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  /**
   * Generar un Access Token JWT seguro.
   */
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role || 'user', // Puedes añadir roles para permisos
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } // Token válido por 15 minutos
    );
  }

  /**
   * Generar un Refresh Token JWT seguro.
   */
  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '1d' } // Refresh token válido por 7 días
    );
  }

  /**
   * Validar si un username es válido (puedes añadir más restricciones).
   */
  static async isValidUsername(username) {
    const user = await User.findOne({ where: { username } });
    return !user && /^[a-zA-Z0-9_]{3,20}$/.test(username); // Solo letras, números y guiones bajos
  }

  /**
   * Validar si una contraseña cumple con los requisitos.
   * - Longitud mínima de 8 caracteres.
   * - Incluye letras mayúsculas, minúsculas, números y caracteres especiales.
   */
  static isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  /**
   * Verificar un Access Token.
   */
  static verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { success: true, decoded };
    } catch (error) {
      return { success: false, message: 'Token inválido o expirado.' };
    }
  }
}

module.exports = LoginService;
