const router = require('express').Router();
const { poolConnect, sql, pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middlewares/auth');

// Obtener todos los usuarios
router.get('/', verifyToken, async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT UsuarioID, NombreUsuario, CorreoElectronico, FechaRegistro
      FROM UsersJoel
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// Obtener usuario por ID
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('UsuarioID', sql.Int, id)
      .query('SELECT UsuarioID, NombreUsuario, CorreoElectronico, FechaRegistro FROM UsersJoel WHERE UsuarioID = @UsuarioID');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuario', error: error.message });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  const { NombreUsuario, CorreoElectronico, password } = req.body;

  if (!NombreUsuario || !CorreoElectronico || !password) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    await poolConnect;
    const hash = await bcrypt.hash(password, 10);

    await pool.request()
      .input('NombreUsuario', sql.NVarChar, NombreUsuario)
      .input('CorreoElectronico', sql.NVarChar, CorreoElectronico)
      .input('ContrasenaHash', sql.NVarChar, hash)
      .input('FechaRegistro', sql.DateTime, new Date())
      .query(`
        INSERT INTO UsersJoel (NombreUsuario, CorreoElectronico, ContrasenaHash, FechaRegistro)
        VALUES (@NombreUsuario, @CorreoElectronico, @ContrasenaHash, @FechaRegistro)
      `);

    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

// Actualizar usuario
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { NombreUsuario, CorreoElectronico, password } = req.body;

  if (!NombreUsuario && !CorreoElectronico && !password === undefined) {
    return res.status(400).json({ message: 'Nada que actualizar' });
  }

  try {
    await poolConnect;

    let query = 'UPDATE UsersJoel SET ';
    const request = pool.request().input('UsuarioID', sql.Int, id);
    const updates = [];

    if (NombreUsuario) {
      updates.push('NombreUsuario = @NombreUsuario');
      request.input('NombreUsuario', sql.NVarChar, NombreUsuario);
    }
    if (CorreoElectronico) {
      updates.push('CorreoElectronico = @CorreoElectronico');
      request.input('CorreoElectronico', sql.NVarChar, CorreoElectronico);
    }
    if (password) {
      updates.push('ContrasenaHash = @ContrasenaHash');
      const hashed = await bcrypt.hash(password, 10);
      request.input('ContrasenaHash', sql.NVarChar, hashed);
    }
    

    query += updates.join(', ') + ' WHERE UsuarioID = @UsuarioID';

    await request.query(query);
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// Eliminar usuario
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('UsuarioID', sql.Int, id)
      .query('DELETE FROM UsersJoel WHERE UsuarioID = @UsuarioID');

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;
