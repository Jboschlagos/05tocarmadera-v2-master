import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { normalizarEmail, LARGO_MINIMO_PASSWORD } from "@/lib/validar";

// POST /api/register
// Crea un usuario nuevo con contraseña hasheada. Rol por defecto: "user".
//
// Importante: el minLength del formulario solo ayuda al usuario honesto.
// Cualquiera puede llamar a esta API directamente (con Postman, curl...)
// saltándose el formulario, por eso SIEMPRE se valida también aquí.
export async function POST(request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const email = normalizarEmail(body.email);
    const password = String(body.password ?? "");

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          error: "Los campos 'username', 'email' y 'password' son obligatorios",
        },
        { status: 400 },
      );
    }

    // Validación simple de formato: algo@algo.algo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "El email no tiene un formato válido" },
        { status: 400 },
      );
    }

    if (password.length < LARGO_MINIMO_PASSWORD) {
      return NextResponse.json(
        {
          error: `La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`,
        },
        { status: 400 },
      );
    }

    // Verificar que no exista ya el email o el username.
    // LOWER() en la columna cubre usuarios antiguos que se registraron con
    // mayúsculas antes de que normalizáramos los emails.
    const [existing] = await sql`
      SELECT id, username, email FROM users
      WHERE LOWER(email) = ${email} OR username = ${username}
    `;

    if (existing) {
      const campo =
        existing.email.toLowerCase() === email ? "email" : "username";
      return NextResponse.json(
        { error: `Ya existe una cuenta con ese ${campo}` },
        { status: 409 },
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [newUser] = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${password_hash})
      RETURNING id, username, email, role
    `;

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "No se pudo registrar el usuario" },
      { status: 500 },
    );
  }
}
