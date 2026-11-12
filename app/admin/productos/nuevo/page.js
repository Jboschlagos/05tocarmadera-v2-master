import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import FormularioRecurso from "../../_components/FormularioRecurso";

export default async function NuevoProductoPage() {
  await verificarAdminPagina();
  const talleres =
    await sql`SELECT id, nombre FROM talleres ORDER BY nombre ASC`;

  return (
    <main>
      <h1 className="text-3xl font-bold mb-2">Nuevo producto</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--gris-texto)" }}>
        Después de crearlo podrás subir sus fotos.
      </p>
      <FormularioRecurso recurso="productos" talleres={talleres} />
    </main>
  );
}
