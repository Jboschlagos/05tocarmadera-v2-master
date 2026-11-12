import Link from "next/link";
import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import BotonEliminar from "../_components/BotonEliminar";
import EncabezadoLista from "../_components/EncabezadoLista";

export default async function AdminTalleresPage() {
  await verificarAdminPagina();

  const talleres = await sql`
    SELECT t.id, t.nombre, t.oficio, t.ciudad, t.region,
      (SELECT COUNT(*) FROM products p WHERE p.taller_id = t.id)::int AS productos
    FROM talleres t
    ORDER BY t.nombre ASC
  `;

  return (
    <main>
      <EncabezadoLista
        titulo="Talleres"
        nuevoHref="/admin/talleres/nuevo"
        nuevoTexto="Nuevo taller"
      />

      {talleres.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>Todavía no hay talleres.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">Oficio</th>
                <th className="py-2 pr-4">Ubicación</th>
                <th className="py-2 pr-4">Productos</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {talleres.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-3 pr-4 font-semibold">{t.nombre}</td>
                  <td className="py-3 pr-4">{t.oficio}</td>
                  <td className="py-3 pr-4">
                    {[t.ciudad, t.region].filter(Boolean).join(", ")}
                  </td>
                  <td className="py-3 pr-4">{t.productos}</td>
                  <td className="py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/talleres/${t.id}`}
                        className="underline"
                        style={{ color: "var(--madera)" }}
                      >
                        Editar
                      </Link>
                      <Link href={`/talleres/${t.id}`} className="underline">
                        Ver
                      </Link>
                      <BotonEliminar
                        endpoint={`/api/talleres/${t.id}`}
                        nombre={t.nombre}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
