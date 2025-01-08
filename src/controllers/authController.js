const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registrar usuario
exports.registrar = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
    usuario = new Usuario({ nombre, email, contraseña });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.contraseña = await bcrypt.hash(contraseña, salt);

    await usuario.save();

    // Crear y firmar token
    const payload = { usuario: { id: usuario.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Iniciar sesión
exports.iniciarSesion = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const esMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Crear y firmar token
    const payload = { usuario: { id: usuario.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};
