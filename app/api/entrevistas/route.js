import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/entrevistas
export async function GET() {
  try {
    const entrevistas = await sql`
      SELECT
        id, titulo, taller, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region,
        lat, lng, youtube_id, taller_id
      FROM entrevistas
      ORDER BY fecha DESC
    `;

    return NextResponse.json({ entrevistas });
  } catch (error) {
    console.error("Error al obtener entrevistas:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las entrevistas" },
      { status: 500 },
    );
  }
}

// POST /api/entrevistas — solo admin
export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      titulo,
      taller,
      oficio,
      descripcion,
      tecnica,
      instagram_url,
      imagen_principal,
      fecha,
      ciudad,
      region,
      lat,
      lng,
      youtube_id,
      taller_id,
    } = body;

    const faltantes = [];
    if (!titulo) faltantes.push("titulo");
    if (!taller) faltantes.push("taller");
    if (!oficio) faltantes.push("oficio");
    if (!fecha) faltantes.push("fecha");
    if (!youtube_id) faltantes.push("youtube_id");

    if (faltantes.length > 0) {
      return NextResponse.json(
        { error: `Faltan campos obligatorios: ${faltantes.join(", ")}` },
        { status: 400 },
      );
    }

    const [newEntrevista] = await sql`
      INSERT INTO entrevistas (
        titulo, taller, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region,
        lat, lng, youtube_id, taller_id
      )
      VALUES (
        ${titulo}, ${taller}, ${oficio}, ${descripcion ?? null}, ${tecnica ?? null},
        ${instagram_url ?? null}, ${imagen_principal ?? null}, ${fecha}, ${ciudad ?? null}, ${region ?? null},
        ${lat ?? null}, ${lng ?? null}, ${youtube_id}, ${taller_id ?? null}
      )
      RETURNING id, titulo, taller, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region, lat, lng, youtube_id, taller_id
    `;

    return NextResponse.json({ entrevista: newEntrevista }, { status: 201 });
  } catch (error) {
    console.error("Error al crear entrevista:", error);
    return NextResponse.json(
      { error: "No se pudo crear la entrevista" },
      { status: 500 },
    );
  }
}
