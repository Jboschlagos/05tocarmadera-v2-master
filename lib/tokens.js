import crypto from "crypto";

// Genera un token aleatorio largo (64 caracteres hex). Este es el que va
// en el link del correo.
export function generarToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Convierte el token en un "hash" SHA-256. En la base de datos guardamos
// SOLO el hash: si alguien llegara a ver la tabla users, no podría usar
// esos valores para resetear contraseñas, porque necesitaría el token
// original (y un hash no se puede "devolver" al valor original).
// Es la misma idea que con las contraseñas y bcrypt.
export function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}
