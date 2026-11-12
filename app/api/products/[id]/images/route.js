import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { esIdValido } from "@/lib/validar";

// GET /api/products/[id]/images
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!esIdValido(id)) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    const images = await sql`
      SELECT id, product_id, image_url, orden
      FROM product_images
      WHERE product_id = ${id}
      ORDER BY orden ASC
    `;

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las imágenes" },
      { status: 500 },
    );
  }
}

// POST /api/products/[id]/images — solo admin
export async function POST(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!esIdValido(id)) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { image_url, orden } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: "El campo 'image_url' es obligatorio" },
        { status: 400 },
      );
    }

    const [newImage] = await sql`
      INSERT INTO product_images (product_id, image_url, orden)
      VALUES (${id}, ${image_url}, ${orden ?? 0})
      RETURNING id, product_id, image_url, orden
    `;

    return NextResponse.json({ image: newImage }, { status: 201 });
  } catch (error) {
    console.error("Error al crear imagen:", error);
    return NextResponse.json(
      { error: "No se pudo crear la imagen" },
      { status: 500 },
    );
  }
}
