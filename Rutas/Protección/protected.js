const express = require('express');
const verifyToken = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Bienvenido al dashboard protegido.', user: req.user });
});

module.exports = router;
