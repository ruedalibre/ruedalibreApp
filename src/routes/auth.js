const express = require('express');
const router = express.Router();
const { registrar, iniciarSesion } = require('../controllers/authController');

// Rutas de autenticación
router.post('/register', registrar);
router.post('/login', iniciarSesion);

module.exports = router;
