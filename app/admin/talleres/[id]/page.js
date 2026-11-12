import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import { esIdValido } from "@/lib/validar";
import FormularioRecurso from "../../_components/FormularioRecurso";

export default async function EditarTallerPage({ params }) {
  await verificarAdminPagina();
  const { id } = await params;
  if (!esIdValido(id)) notFound();

  const [taller] = await sql`SELECT * FROM talleres WHERE id = ${id}`;
  if (!taller) notFound();

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Editar: {taller.nombre}</h1>
      {/* key={taller.id}: si cambias de taller, React crea el formulario de
          cero en vez de reutilizar el estado del anterior. */}
      <FormularioRecurso key={taller.id} recurso="talleres" registro={taller} />
    </main>
  );
}
