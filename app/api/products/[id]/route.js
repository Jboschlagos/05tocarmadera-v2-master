import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { esIdValido, viene } from "@/lib/validar";

const NO_ENCONTRADO = () =>
  NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

// GET /api/products/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADO();

    const [product] = await sql`
      SELECT id, name, description, price, image_url, ciudad, region, lat, lng, taller_id
      FROM products
      WHERE id = ${id}
    `;

    if (!product) return NO_ENCONTRADO();

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el producto" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id] — solo admin
// Solo se actualizan los campos que vienen en el body (ver explicación del
// CASE WHEN en app/api/entrevistas/[id]/route.js).
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADO();

    const b = await request.json();

    if (viene(b, "name") && !b.name) {
      return NextResponse.json(
        { error: "El campo 'name' no puede quedar vacío" },
        { status: 400 },
      );
    }
    if (
      viene(b, "price") &&
      (b.price === null ||
        b.price === "" ||
        !Number.isFinite(Number(b.price)) ||
        Number(b.price) < 0)
    ) {
      return NextResponse.json(
        { error: "'price' debe ser un número mayor o igual a 0" },
        { status: 400 },
      );
    }

    const [updated] = await sql`
      UPDATE products
      SET
        name = CASE WHEN ${viene(b, "name")}::boolean THEN ${b.name ?? null} ELSE name END,
        description = CASE WHEN ${viene(b, "description")}::boolean THEN ${b.description ?? null} ELSE description END,
        price = CASE WHEN ${viene(b, "price")}::boolean THEN ${b.price ?? null} ELSE price END,
        image_url = CASE WHEN ${viene(b, "image_url")}::boolean THEN ${b.image_url ?? null} ELSE image_url END,
        ciudad = CASE WHEN ${viene(b, "ciudad")}::boolean THEN ${b.ciudad ?? null} ELSE ciudad END,
        region = CASE WHEN ${viene(b, "region")}::boolean THEN ${b.region ?? null} ELSE region END,
        lat = CASE WHEN ${viene(b, "lat")}::boolean THEN ${b.lat ?? null} ELSE lat END,
        lng = CASE WHEN ${viene(b, "lng")}::boolean THEN ${b.lng ?? null} ELSE lng END,
        taller_id = CASE WHEN ${viene(b, "taller_id")}::boolean THEN ${b.taller_id ?? null} ELSE taller_id END
      WHERE id = ${id}
      RETURNING id, name, description, price, image_url, ciudad, region, lat, lng, taller_id
    `;

    if (!updated) return NO_ENCONTRADO();

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADO();

    // Antes eran 3 consultas sueltas: si la última fallaba, quedaban las
    // imágenes borradas pero el producto vivo. Con sql.transaction se
    // ejecutan como una sola unidad: o se aplican todas, o ninguna.
    const [, , deleted] = await sql.transaction([
      sql`DELETE FROM product_images WHERE product_id = ${id}`,
      sql`DELETE FROM cart_items WHERE product_id = ${id}`,
      sql`DELETE FROM products WHERE id = ${id} RETURNING id`,
    ]);

    if (deleted.length === 0) return NO_ENCONTRADO();

    return NextResponse.json({
      message: "Producto eliminado",
      id: deleted[0].id,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 },
    );
  }
}
