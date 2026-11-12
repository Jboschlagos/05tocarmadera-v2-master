import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { esIdValido } from "@/lib/validar";

// PUT /api/products/[id]/images/[imageId] — solo admin
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id, imageId } = await params;
    if (!esIdValido(id) || !esIdValido(imageId)) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 },
      );
    }
    const body = await request.json();
    const { image_url, orden } = body;

    const [updated] = await sql`
      UPDATE product_images
      SET
        image_url = COALESCE(${image_url}, image_url),
        orden = COALESCE(${orden}, orden)
      WHERE id = ${imageId} AND product_id = ${id}
      RETURNING id, product_id, image_url, orden
    `;

    if (!updated) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ image: updated });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la imagen" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id]/images/[imageId] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id, imageId } = await params;
    if (!esIdValido(id) || !esIdValido(imageId)) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 },
      );
    }

    const [deleted] = await sql`
      DELETE FROM product_images
      WHERE id = ${imageId} AND product_id = ${id}
      RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Imagen eliminada", id: deleted.id });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la imagen" },
      { status: 500 },
    );
  }
}
