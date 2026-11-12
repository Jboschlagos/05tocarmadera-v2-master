import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Verifica que haya sesión activa (cualquier rol).
// Devuelve { session } si está bien, o { error } listo para retornar.
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    return { error: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }

  return { session };
}
