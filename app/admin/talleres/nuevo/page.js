import { verificarAdminPagina } from "@/lib/requireAdmin";
import FormularioRecurso from "../../_components/FormularioRecurso";

export default async function NuevoTallerPage() {
  await verificarAdminPagina();

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Nuevo taller</h1>
      <FormularioRecurso recurso="talleres" />
    </main>
  );
}
