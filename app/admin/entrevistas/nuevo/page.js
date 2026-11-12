import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import FormularioRecurso from "../../_components/FormularioRecurso";

export default async function NuevaEntrevistaPage() {
  await verificarAdminPagina();
  const talleres =
    await sql`SELECT id, nombre FROM talleres ORDER BY nombre ASC`;

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Nueva entrevista</h1>
      <FormularioRecurso recurso="entrevistas" talleres={talleres} />
    </main>
  );
}
