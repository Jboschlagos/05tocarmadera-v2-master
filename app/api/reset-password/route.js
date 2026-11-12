import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { LARGO_MINIMO_PASSWORD } from "@/lib/validar";
import { hashToken } from "@/lib/tokens";

// POST /api/reset-password
// Recibe el token (que venía en el link del correo) y la nueva
// contraseña. Si el token es válido y no ha expirado, actualiza la
// contraseña del usuario y "quema" el token para que no se pueda
// volver a usar.
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Los campos 'token' y 'password' son obligatorios" },
        { status: 400 },
      );
    }

    if (String(password).length < LARGO_MINIMO_PASSWORD) {
      return NextResponse.json(
        {
          error: `La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`,
        },
        { status: 400 },
      );
    }

    // En la base guardamos el hash, así que hasheamos lo que llega y comparamos.
    const [user] = await sql`
      SELECT id, reset_token_expires FROM users
      WHERE reset_token = ${hashToken(token)}
    `;

    if (!user) {
      return NextResponse.json(
        { error: "El link de recuperación no es válido" },
        { status: 400 },
      );
    }

    const expiro = new Date(user.reset_token_expires) < new Date();
    if (expiro) {
      return NextResponse.json(
        { error: "El link de recuperación expiró, solicita uno nuevo" },
        { status: 400 },
      );
    }

    const password_hash = await bcrypt.hash(String(password), 10);

    await sql`
      UPDATE users
      SET password_hash = ${password_hash}, reset_token = NULL, reset_token_expires = NULL
      WHERE id = ${user.id}
    `;

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return NextResponse.json(
      { error: "No se pudo restablecer la contraseña" },
      { status: 500 },
    );
  }
}
