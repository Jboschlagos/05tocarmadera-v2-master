import Link from "next/link";
import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";

export default async function AdminInicioPage() {
  const session = await verificarAdminPagina();

  // Una sola consulta que cuenta todo: cada subconsulta devuelve un número.
  const [totales] = await sql`
    SELECT
      (SELECT COUNT(*) FROM talleres)::int    AS talleres,
      (SELECT COUNT(*) FROM products)::int    AS productos,
      (SELECT COUNT(*) FROM entrevistas)::int AS entrevistas,
      (SELECT COUNT(*) FROM users)::int       AS usuarios
  `;

  const tarjetas = [
    { label: "Talleres", valor: totales.talleres, href: "/admin/talleres" },
    { label: "Productos", valor: totales.productos, href: "/admin/productos" },
    {
      label: "Entrevistas",
      valor: totales.entrevistas,
      href: "/admin/entrevistas",
    },
    { label: "Usuarios registrados", valor: totales.usuarios },
  ];

  return (
    <main>
      <h1 className="text-3xl font-bold mb-2">Hola, {session.user.name}</h1>
      <p className="mb-8" style={{ color: "var(--gris-texto)" }}>
        Desde aquí puedes crear, editar y eliminar el contenido del sitio.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((t) => {
          const contenido = (
            <>
              <p
                className="text-3xl font-bold"
                style={{ color: "var(--madera)" }}
              >
                {t.valor}
              </p>
              <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                {t.label}
              </p>
            </>
          );
          return t.href ? (
            <Link
              key={t.label}
              href={t.href}
              className="rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              {contenido}
            </Link>
          ) : (
            <div
              key={t.label}
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              {contenido}
            </div>
          );
        })}
      </div>
    </main>
  );
}
