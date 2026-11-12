import { cache } from "react";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { esIdValido } from "@/lib/validar";
import AgregarAlCarrito from "@/app/components/AgregarAlCarrito";

// `cache` de React: si generateMetadata y la página piden el mismo producto
// durante la misma visita, la consulta a la base se hace una sola vez.
const obtenerProducto = cache(async (id) => {
  if (!esIdValido(id)) return null;
  const [product] = await sql`
    SELECT p.id, p.name, p.description, p.price, p.ciudad, p.region,
      t.id AS taller_id, t.nombre AS taller_nombre
    FROM products p
    LEFT JOIN talleres t ON t.id = p.taller_id
    WHERE p.id = ${id}
  `;
  return product ?? null;
});

// Título y descripción propios para cada producto (Google, WhatsApp, etc.).
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await obtenerProducto(id);
  if (!product) return { title: "Producto no encontrado | Tocar Madera" };
  return {
    title: `${product.name} | Mercado Tocar Madera`,
    description:
      product.description?.slice(0, 160) || `Pieza de madera hecha en Chile.`,
  };
}

export default async function ProductoDetallePage({ params }) {
  const { id } = await params;
  const product = await obtenerProducto(id);

  if (!product) {
    notFound();
  }

  const images = await sql`
    SELECT id, image_url
    FROM product_images
    WHERE product_id = ${id}
    ORDER BY orden ASC
  `;

  return (
    <main className="max-w-5xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {images.length === 0 ? (
            <div
              className="w-full h-80 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              <p style={{ color: "var(--gris-texto)" }}>Sin imágenes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative w-full h-80 rounded-xl overflow-hidden">
                <Image
                  src={images[0].image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1).map((img, i) => (
                    <div
                      key={img.id}
                      className="relative w-full h-20 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img.image_url}
                        alt={`${product.name} — foto ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--madera)" }}
          >
            ${Number(product.price).toLocaleString("es-CL")}
          </p>

          {product.taller_nombre && (
            <p className="text-sm mb-4" style={{ color: "var(--gris-texto)" }}>
              Hecho por{" "}
              <Link
                href={`/talleres/${product.taller_id}`}
                className="underline font-semibold"
              >
                {product.taller_nombre}
              </Link>
            </p>
          )}

          <p
            className="mb-6 whitespace-pre-line"
            style={{ color: "var(--oscuro)" }}
          >
            {product.description || "Sin descripción disponible."}
          </p>

          {(product.ciudad || product.region) && (
            <p className="text-sm mb-6" style={{ color: "var(--gris-texto)" }}>
              📍 {[product.ciudad, product.region].filter(Boolean).join(", ")}
            </p>
          )}

          <AgregarAlCarrito productId={product.id} />
        </div>
      </div>
    </main>
  );
}
