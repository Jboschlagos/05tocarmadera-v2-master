import Link from "next/link";
import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import BotonEliminar from "../_components/BotonEliminar";
import EncabezadoLista from "../_components/EncabezadoLista";

export default async function AdminEntrevistasPage() {
  await verificarAdminPagina();

  // to_char formatea la fecha en SQL; así no dependemos de zonas horarias en JS.
  const entrevistas = await sql`
    SELECT id, titulo, taller, to_char(fecha, 'DD-MM-YYYY') AS fecha, taller_id
    FROM entrevistas
    ORDER BY entrevistas.fecha DESC
  `;

  return (
    <main>
      <EncabezadoLista
        titulo="Entrevistas"
        nuevoHref="/admin/entrevistas/nuevo"
        nuevoTexto="Nueva entrevista"
      />

      {entrevistas.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>
          Todavía no hay entrevistas.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Título</th>
                <th className="py-2 pr-4">Taller</th>
                <th className="py-2 pr-4">Fecha</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entrevistas.map((e) => (
                <tr key={e.id} className="border-b">
                  <td className="py-3 pr-4 font-semibold">{e.titulo}</td>
                  <td className="py-3 pr-4">
                    {e.taller}
                    {!e.taller_id && (
                      <span
                        className="ml-2 text-xs"
                        style={{ color: "var(--gris-texto)" }}
                      >
                        (sin vincular)
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">{e.fecha}</td>
                  <td className="py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/entrevistas/${e.id}`}
                        className="underline"
                        style={{ color: "var(--madera)" }}
                      >
                        Editar
                      </Link>
                      <Link href={`/entrevistas/${e.id}`} className="underline">
                        Ver
                      </Link>
                      <BotonEliminar
                        endpoint={`/api/entrevistas/${e.id}`}
                        nombre={e.titulo}
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
