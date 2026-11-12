import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";
import { esIdValido, CANTIDAD_MAXIMA } from "@/lib/validar";

// GET /api/cart
// Devuelve el carrito del usuario logueado, con los datos del producto incluidos.
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    // La foto del producto vive en product_images (la primera según "orden").
    // Si no tiene, usamos la columna antigua products.image_url como respaldo.
    const items = await sql`
      SELECT
        ci.id, ci.quantity,
        p.id AS product_id, p.name, p.price,
        COALESCE(
          (SELECT pi.image_url FROM product_images pi
           WHERE pi.product_id = p.id ORDER BY pi.orden ASC LIMIT 1),
          p.image_url
        ) AS image_url
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ${session.user.id}
      ORDER BY ci.id DESC
    `;

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Error al obtener el carrito:", err);
    return NextResponse.json(
      { error: "No se pudo obtener el carrito" },
      { status: 500 },
    );
  }
}

// POST /api/cart
// Agrega un producto al carrito. Si ya existe, suma la cantidad en vez de duplicar.
export async function POST(request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { product_id } = body;
    const cantidad = body.quantity ?? 1;

    if (!esIdValido(product_id)) {
      return NextResponse.json(
        { error: "El campo 'product_id' es obligatorio" },
        { status: 400 },
      );
    }

    // Number.isInteger rechaza 1.5, "abc", -3, etc.
    if (
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > CANTIDAD_MAXIMA
    ) {
      return NextResponse.json(
        {
          error: `La cantidad debe ser un entero entre 1 y ${CANTIDAD_MAXIMA}`,
        },
        { status: 400 },
      );
    }

    const [producto] =
      await sql`SELECT id FROM products WHERE id = ${product_id}`;
    if (!producto) {
      return NextResponse.json(
        { error: "El producto no existe" },
        { status: 404 },
      );
    }

    // "Upsert" en UNA sola consulta: si ya existe la fila (mismo usuario +
    // mismo producto) se actualiza; si no, se inserta. Esto evita filas
    // duplicadas cuando llegan dos clics casi al mismo tiempo.
    // Requiere la restricción UNIQUE (user_id, product_id) — ver
    // db/migraciones/001_mejoras.sql.
    const [item] = await sql`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (${session.user.id}, ${product_id}, ${cantidad})
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, ${CANTIDAD_MAXIMA})
      RETURNING id, user_id, product_id, quantity
    `;

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("Error al agregar al carrito:", err);
    return NextResponse.json(
      { error: "No se pudo agregar al carrito" },
      { status: 500 },
    );
  }
}
