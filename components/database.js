// ✅ Nueva versión compatible con Expo SDK 51+
// Usa la API asíncrona de expo-sqlite

import { openDatabaseAsync } from 'expo-sqlite';

let db;

/** Inicializa la base de datos y crea la tabla si no existe */
export async function initDB() {
  db = await openDatabaseAsync('appPeliculas.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rol TEXT NOT NULL
    );
  `);
}

/** Obtiene todos los usuarios */
export async function getAllUsers() {
  if (!db) await initDB();
  const res = await db.getAllAsync('SELECT * FROM usuarios;');
  return res;
}

/** Busca un usuario por credenciales (login) */
export async function findUserByCredentials(username, password) {
  if (!db) await initDB();
  const res = await db.getAllAsync(
    'SELECT * FROM usuarios WHERE username = ? AND password = ? LIMIT 1;',
    [username, password]
  );
  return res.length > 0 ? res[0] : null;
}

/** Crea un nuevo usuario */
export async function createUser({ nombre, username, password, rol = 'user' }) {
  if (!db) await initDB();
  await db.runAsync(
    'INSERT INTO usuarios (nombre, username, password, rol) VALUES (?, ?, ?, ?);',
    [nombre, username, password, rol]
  );
}

/** Actualiza un usuario existente */
export async function updateUser({ id, nombre, username, password, rol }) {
  if (!db) await initDB();
  await db.runAsync(
    'UPDATE usuarios SET nombre=?, username=?, password=?, rol=? WHERE id=?;',
    [nombre, username, password, rol, id]
  );
}

/** Elimina un usuario por ID */
export async function deleteUser(id) {
  if (!db) await initDB();
  await db.runAsync('DELETE FROM usuarios WHERE id=?;', [id]);
}

/** Garantiza que exista un admin por defecto */
export async function ensureAdmin() {
  await initDB();
  await db.runAsync(`
    INSERT OR IGNORE INTO usuarios (nombre, username, password, rol)
    VALUES ('Admin','admin','admin123','admin');
  `);
}

export default db;
