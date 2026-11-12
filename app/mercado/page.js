import { sql } from "@/lib/db";
import ProductosConMapa from "@/app/components/ProductosConMapa";

export const dynamic = "force-dynamic"; // ver explicación en app/entrevistas/page.js

export const metadata = {
  title: "Mercado | Tocar Madera",
};

export default async function MercadoPage() {
  const products = await sql`
    SELECT
      p.id, p.name, p.price, p.ciudad, p.region, p.lat, p.lng,
      t.nombre AS taller_nombre,
      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.orden ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    LEFT JOIN talleres t ON t.id = p.taller_id
    ORDER BY p.id DESC
  `;

  return (
    <main className="max-w-7xl mx-auto px-8 py-16">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--oscuro)" }}
      >
        Mercado
      </h1>
      <ProductosConMapa productos={products} />
    </main>
  );
}
