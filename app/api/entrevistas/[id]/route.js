import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { esIdValido, viene } from "@/lib/validar";

const NO_ENCONTRADA = () =>
  NextResponse.json({ error: "Entrevista no encontrada" }, { status: 404 });

// GET /api/entrevistas/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADA();

    const [entrevista] = await sql`
      SELECT id, titulo, taller, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region,
        lat, lng, youtube_id, taller_id
      FROM entrevistas
      WHERE id = ${id}
    `;

    if (!entrevista) return NO_ENCONTRADA();

    return NextResponse.json({ entrevista });
  } catch (error) {
    console.error("Error al obtener entrevista:", error);
    return NextResponse.json(
      { error: "No se pudo obtener la entrevista" },
      { status: 500 },
    );
  }
}

// PUT /api/entrevistas/[id] — solo admin
//
// Cómo funciona el "CASE WHEN":
//   campo = CASE WHEN <¿vino en el body?> THEN <valor nuevo> ELSE campo END
// - Si el campo NO viene en el body → se queda como estaba.
// - Si viene (aunque sea null) → se guarda ese valor. Así se puede vaciar un
//   campo, cosa que con COALESCE era imposible (COALESCE(null, x) = x).
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADA();

    const b = await request.json();

    // Los campos obligatorios, si vienen, no pueden venir vacíos.
    for (const campo of ["titulo", "taller", "oficio", "fecha", "youtube_id"]) {
      if (viene(b, campo) && !b[campo]) {
        return NextResponse.json(
          { error: `El campo '${campo}' no puede quedar vacío` },
          { status: 400 },
        );
      }
    }

    const [updated] = await sql`
      UPDATE entrevistas
      SET
        titulo = CASE WHEN ${viene(b, "titulo")}::boolean THEN ${b.titulo ?? null} ELSE titulo END,
        taller = CASE WHEN ${viene(b, "taller")}::boolean THEN ${b.taller ?? null} ELSE taller END,
        oficio = CASE WHEN ${viene(b, "oficio")}::boolean THEN ${b.oficio ?? null} ELSE oficio END,
        descripcion = CASE WHEN ${viene(b, "descripcion")}::boolean THEN ${b.descripcion ?? null} ELSE descripcion END,
        tecnica = CASE WHEN ${viene(b, "tecnica")}::boolean THEN ${b.tecnica ?? null} ELSE tecnica END,
        instagram_url = CASE WHEN ${viene(b, "instagram_url")}::boolean THEN ${b.instagram_url ?? null} ELSE instagram_url END,
        imagen_principal = CASE WHEN ${viene(b, "imagen_principal")}::boolean THEN ${b.imagen_principal ?? null} ELSE imagen_principal END,
        fecha = CASE WHEN ${viene(b, "fecha")}::boolean THEN ${b.fecha ?? null} ELSE fecha END,
        ciudad = CASE WHEN ${viene(b, "ciudad")}::boolean THEN ${b.ciudad ?? null} ELSE ciudad END,
        region = CASE WHEN ${viene(b, "region")}::boolean THEN ${b.region ?? null} ELSE region END,
        lat = CASE WHEN ${viene(b, "lat")}::boolean THEN ${b.lat ?? null} ELSE lat END,
        lng = CASE WHEN ${viene(b, "lng")}::boolean THEN ${b.lng ?? null} ELSE lng END,
        youtube_id = CASE WHEN ${viene(b, "youtube_id")}::boolean THEN ${b.youtube_id ?? null} ELSE youtube_id END,
        taller_id = CASE WHEN ${viene(b, "taller_id")}::boolean THEN ${b.taller_id ?? null} ELSE taller_id END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, titulo, taller, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region, lat, lng, youtube_id, taller_id
    `;

    if (!updated) return NO_ENCONTRADA();

    return NextResponse.json({ entrevista: updated });
  } catch (error) {
    console.error("Error al actualizar entrevista:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la entrevista" },
      { status: 500 },
    );
  }
}

// DELETE /api/entrevistas/[id] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADA();

    const [deleted] = await sql`
      DELETE FROM entrevistas WHERE id = ${id}
      RETURNING id
    `;

    if (!deleted) return NO_ENCONTRADA();

    return NextResponse.json({
      message: "Entrevista eliminada",
      id: deleted.id,
    });
  } catch (error) {
    console.error("Error al eliminar entrevista:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la entrevista" },
      { status: 500 },
    );
  }
}
