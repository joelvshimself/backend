const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolConnect, sql, pool } = require('../config/db');

router.post('/login', async (req, res) => {
  const { CorreoElectronico, password } = req.body;

  if (!CorreoElectronico || !password) {
    return res.status(400).json({ message: 'Correo y contraseña requeridos' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('CorreoElectronico', sql.NVarChar, CorreoElectronico)
      .query('SELECT * FROM UsersJoel WHERE CorreoElectronico = @CorreoElectronico');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    const match = await bcrypt.compare(password, user.ContrasenaHash);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.UsuarioID, email: user.CorreoElectronico },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en login', error: error.message });
  }
});

module.exports = router;
