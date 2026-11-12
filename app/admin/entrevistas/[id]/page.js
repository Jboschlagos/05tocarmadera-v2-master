import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import { esIdValido } from "@/lib/validar";
import FormularioRecurso from "../../_components/FormularioRecurso";

export default async function EditarEntrevistaPage({ params }) {
  await verificarAdminPagina();
  const { id } = await params;
  if (!esIdValido(id)) notFound();

  // El <input type="date"> necesita la fecha como "AAAA-MM-DD".
  // La formateamos en SQL para evitar problemas de zona horaria.
  const [[entrevista], talleres] = await Promise.all([
    sql`
      SELECT id, titulo, taller, oficio, descripcion, tecnica, instagram_url,
        imagen_principal, to_char(fecha, 'YYYY-MM-DD') AS fecha, ciudad, region,
        lat, lng, youtube_id, taller_id
      FROM entrevistas WHERE id = ${id}
    `,
    sql`SELECT id, nombre FROM talleres ORDER BY nombre ASC`,
  ]);
  if (!entrevista) notFound();

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Editar: {entrevista.titulo}</h1>
      <FormularioRecurso
        key={entrevista.id}
        recurso="entrevistas"
        registro={entrevista}
        talleres={talleres}
      />
    </main>
  );
}
