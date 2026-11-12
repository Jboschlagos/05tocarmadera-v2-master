import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/products
// Devuelve todos los productos. Pública, sin auth.
export async function GET() {
  try {
    const products = await sql`
      SELECT id, name, description, price, image_url, ciudad, region, lat, lng, taller_id
      FROM products
      ORDER BY id DESC
    `;

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los productos" },
      { status: 500 },
    );
  }
}

// POST /api/products
// Crea un producto nuevo. Solo admin.
export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      image_url,
      ciudad,
      region,
      lat,
      lng,
      taller_id,
    } = body;

    // Number("abc") es NaN y Number.isFinite(NaN) es false: así detectamos
    // precios que no son números de verdad.
    const precioVacio = price === undefined || price === null || price === "";
    if (
      !name ||
      precioVacio ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return NextResponse.json(
        {
          error:
            "'name' es obligatorio y 'price' debe ser un número mayor o igual a 0",
        },
        { status: 400 },
      );
    }

    const [newProduct] = await sql`
      INSERT INTO products (name, description, price, image_url, ciudad, region, lat, lng, taller_id)
      VALUES (${name}, ${description ?? null}, ${price}, ${image_url ?? null}, ${ciudad ?? null}, ${region ?? null}, ${lat ?? null}, ${lng ?? null}, ${taller_id ?? null})
      RETURNING id, name, description, price, image_url, ciudad, region, lat, lng, taller_id
    `;

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "No se pudo crear el producto" },
      { status: 500 },
    );
  }
}
