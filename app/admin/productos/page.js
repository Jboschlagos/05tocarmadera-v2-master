import Link from "next/link";
import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import BotonEliminar from "../_components/BotonEliminar";
import EncabezadoLista from "../_components/EncabezadoLista";

export default async function AdminProductosPage() {
  await verificarAdminPagina();

  const productos = await sql`
    SELECT p.id, p.name, p.price, t.nombre AS taller_nombre,
      (SELECT COUNT(*) FROM product_images pi WHERE pi.product_id = p.id)::int AS fotos
    FROM products p
    LEFT JOIN talleres t ON t.id = p.taller_id
    ORDER BY p.id DESC
  `;

  return (
    <main>
      <EncabezadoLista
        titulo="Productos"
        nuevoHref="/admin/productos/nuevo"
        nuevoTexto="Nuevo producto"
      />

      {productos.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>Todavía no hay productos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">Precio</th>
                <th className="py-2 pr-4">Taller</th>
                <th className="py-2 pr-4">Fotos</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 pr-4 font-semibold">{p.name}</td>
                  <td className="py-3 pr-4">
                    ${Number(p.price).toLocaleString("es-CL")}
                  </td>
                  <td className="py-3 pr-4">{p.taller_nombre ?? "—"}</td>
                  <td
                    className={`py-3 pr-4 ${p.fotos === 0 ? "text-red-700" : ""}`}
                  >
                    {p.fotos}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="underline"
                        style={{ color: "var(--madera)" }}
                      >
                        Editar
                      </Link>
                      <Link href={`/mercado/${p.id}`} className="underline">
                        Ver
                      </Link>
                      <BotonEliminar
                        endpoint={`/api/products/${p.id}`}
                        nombre={p.name}
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
