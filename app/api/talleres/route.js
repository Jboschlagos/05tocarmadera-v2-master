import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/talleres
export async function GET() {
  try {
    const talleres = await sql`
      SELECT id, nombre, oficio, bio, foto_url, instagram_url,
        ciudad, region, lat, lng,
        direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
      FROM talleres
      ORDER BY nombre ASC
    `;

    return NextResponse.json({ talleres });
  } catch (error) {
    console.error("Error al obtener talleres:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los talleres" },
      { status: 500 },
    );
  }
}

// POST /api/talleres — solo admin
export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng,
      direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo,
    } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El campo 'nombre' es obligatorio" },
        { status: 400 },
      );
    }

    const [newTaller] = await sql`
      INSERT INTO talleres (
        nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng,
        direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
      )
      VALUES (
        ${nombre}, ${oficio ?? null}, ${bio ?? null}, ${foto_url ?? null}, ${instagram_url ?? null},
        ${ciudad ?? null}, ${region ?? null}, ${lat ?? null}, ${lng ?? null},
        ${direccion ?? null}, ${telefono ?? null}, ${whatsapp_url ?? null},
        ${sitio_web ?? null}, ${tecnica ?? null}, ${tipo_trabajo ?? null}
      )
      RETURNING id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng,
        direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
    `;

    return NextResponse.json({ taller: newTaller }, { status: 201 });
  } catch (error) {
    console.error("Error al crear taller:", error);
    return NextResponse.json(
      { error: "No se pudo crear el taller" },
      { status: 500 },
    );
  }
}
