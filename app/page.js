import { sql } from "@/lib/db";
import Image from "next/image";
import Carousel from "./components/Carousel";
import Link from "next/link";

const imagenesHero = [
  "/img/carrusel/01.jpg",
  "/img/carrusel/02.jpg",
  "/img/carrusel/03.jpg",
  "/img/carrusel/04.jpg",
  "/img/carrusel/05.jpg",
];

export const dynamic = "force-dynamic"; // ver explicación en app/entrevistas/page.js

export default async function HomePage() {
  // Promise.all lanza las dos consultas AL MISMO TIEMPO y espera ambas.
  // Antes se hacían una después de la otra (el doble de espera).
  const [entrevistas, products] = await Promise.all([
    sql`
    SELECT id, titulo, taller, oficio, imagen_principal, ciudad, region, fecha
    FROM entrevistas
    ORDER BY fecha DESC
    LIMIT 3
  `,
    sql`
    SELECT
      p.id, p.name, p.price, p.ciudad, p.region,
      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.orden ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    ORDER BY p.id DESC
    LIMIT 4
  `,
  ]);

  return (
    <main>
      <section className="max-w-6xl mx-auto px-8 py-8">
        <Carousel images={imagenesHero} />
      </section>

      <section className="max-w-3xl mx-auto px-8 pb-8 text-center">
        <p className="text-lg" style={{ color: "var(--gris-texto)" }}>
          Piezas de madera hechas por talleres chilenos. Conoce a los artesanos,
          su técnica y su ubicación antes de comprar.
        </p>
        <hr
          className="mt-8"
          style={{ borderColor: "#4a4a4a", borderTopWidth: "1px" }}
        />
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16 bg-white">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl font-bold">Historias de Talleres</h2>
          <Link
            href="/entrevistas"
            className="underline"
            style={{ color: "var(--madera)" }}
          >
            Ver todas
          </Link>
        </div>
        {entrevistas.length === 0 ? (
          <p style={{ color: "var(--gris-texto)" }}>
            Aún no hay historias publicadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrevistas.map((entrevista) => (
              <Link
                key={entrevista.id}
                href={`/entrevistas/${entrevista.id}`}
                className="block rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                style={{ backgroundColor: "var(--gris-claro)" }}
              >
                {entrevista.imagen_principal && (
                  <div className="relative w-full h-48">
                    <Image
                      src={entrevista.imagen_principal}
                      alt={entrevista.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">
                    {entrevista.titulo}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                    {entrevista.taller} — {entrevista.oficio}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--gris-texto)" }}
                  >
                    {[entrevista.ciudad, entrevista.region]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--oscuro)" }}
            >
              Mercado
            </h2>
            <Link
              href="/mercado"
              className="underline"
              style={{ color: "var(--madera)" }}
            >
              Ver todo
            </Link>
          </div>
          {products.length === 0 ? (
            <p style={{ color: "var(--gris-texto)" }}>
              Aún no hay productos publicados.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/mercado/${product.id}`}
                  className="block rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                  style={{ backgroundColor: "white" }}
                >
                  {product.image_url && (
                    <div className="relative w-full h-40">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--madera)" }}
                    >
                      ${Number(product.price).toLocaleString("es-CL")}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--gris-texto)" }}
                    >
                      {[product.ciudad, product.region]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
