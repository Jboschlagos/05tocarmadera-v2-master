import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Versión para PÁGINAS (no para la API): si no eres admin, te manda al
// login en vez de devolver JSON. Se llama al inicio de cada página de /admin.
// Ojo: proteger solo el layout no basta, porque al navegar entre páginas
// hijas el layout no se vuelve a ejecutar; por eso cada página lo llama.
export async function verificarAdminPagina() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/");
  return session;
}

// Verifica que haya sesión activa y que el usuario sea admin.
// Devuelve null si todo está bien (puede seguir el endpoint),
// o un NextResponse de error listo para retornar directamente.
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "No tienes permisos de administrador" },
      { status: 403 },
    );
  }

  return null;
}
