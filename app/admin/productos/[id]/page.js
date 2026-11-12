import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { verificarAdminPagina } from "@/lib/requireAdmin";
import { esIdValido } from "@/lib/validar";
import FormularioRecurso from "../../_components/FormularioRecurso";
import GaleriaProducto from "../../_components/GaleriaProducto";

export default async function EditarProductoPage({ params }) {
  await verificarAdminPagina();
  const { id } = await params;
  if (!esIdValido(id)) notFound();

  // Las tres consultas no dependen entre sí, así que van en paralelo.
  const [[producto], talleres, imagenes] = await Promise.all([
    sql`SELECT * FROM products WHERE id = ${id}`,
    sql`SELECT id, nombre FROM talleres ORDER BY nombre ASC`,
    sql`SELECT id, image_url, orden FROM product_images WHERE product_id = ${id} ORDER BY orden ASC, id ASC`,
  ]);
  if (!producto) notFound();

  return (
    <main className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">Editar: {producto.name}</h1>
        <FormularioRecurso
          key={producto.id}
          recurso="productos"
          registro={producto}
          talleres={talleres}
        />
      </div>
      <GaleriaProducto
        key={`galeria-${producto.id}`}
        productId={producto.id}
        imagenesIniciales={imagenes}
      />
    </main>
  );
}
