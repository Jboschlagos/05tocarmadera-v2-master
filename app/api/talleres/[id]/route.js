import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { esIdValido, viene } from "@/lib/validar";

const NO_ENCONTRADO = () =>
  NextResponse.json({ error: "Taller no encontrado" }, { status: 404 });

// GET /api/talleres/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADO();

    const [taller] = await sql`
      SELECT id, nombre, oficio, bio, foto_url, instagram_url,
        ciudad, region, lat, lng,
        direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
      FROM talleres
      WHERE id = ${id}
    `;

    if (!taller) return NO_ENCONTRADO();

    return NextResponse.json({ taller });
  } catch (error) {
    console.error("Error al obtener taller:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el taller" },
      { status: 500 },
    );
  }
}

// PUT /api/talleres/[id] — solo admin
// Solo se actualizan los campos que vienen en el body (ver explicación del
// CASE WHEN en app/api/entrevistas/[id]/route.js).
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADO();

    const b = await request.json();

    if (viene(b, "nombre") && !b.nombre) {
      return NextResponse.json(
        { error: "El campo 'nombre' no puede quedar vacío" },
        { status: 400 },
      );
    }

    const [updated] = await sql`
      UPDATE talleres
      SET
        nombre = CASE WHEN ${viene(b, "nombre")}::boolean THEN ${b.nombre ?? null} ELSE nombre END,
        oficio = CASE WHEN ${viene(b, "oficio")}::boolean THEN ${b.oficio ?? null} ELSE oficio END,
        bio = CASE WHEN ${viene(b, "bio")}::boolean THEN ${b.bio ?? null} ELSE bio END,
        foto_url = CASE WHEN ${viene(b, "foto_url")}::boolean THEN ${b.foto_url ?? null} ELSE foto_url END,
        instagram_url = CASE WHEN ${viene(b, "instagram_url")}::boolean THEN ${b.instagram_url ?? null} ELSE instagram_url END,
        ciudad = CASE WHEN ${viene(b, "ciudad")}::boolean THEN ${b.ciudad ?? null} ELSE ciudad END,
        region = CASE WHEN ${viene(b, "region")}::boolean THEN ${b.region ?? null} ELSE region END,
        lat = CASE WHEN ${viene(b, "lat")}::boolean THEN ${b.lat ?? null} ELSE lat END,
        lng = CASE WHEN ${viene(b, "lng")}::boolean THEN ${b.lng ?? null} ELSE lng END,
        direccion = CASE WHEN ${viene(b, "direccion")}::boolean THEN ${b.direccion ?? null} ELSE direccion END,
        telefono = CASE WHEN ${viene(b, "telefono")}::boolean THEN ${b.telefono ?? null} ELSE telefono END,
        whatsapp_url = CASE WHEN ${viene(b, "whatsapp_url")}::boolean THEN ${b.whatsapp_url ?? null} ELSE whatsapp_url END,
        sitio_web = CASE WHEN ${viene(b, "sitio_web")}::boolean THEN ${b.sitio_web ?? null} ELSE sitio_web END,
        tecnica = CASE WHEN ${viene(b, "tecnica")}::boolean THEN ${b.tecnica ?? null} ELSE tecnica END,
        tipo_trabajo = CASE WHEN ${viene(b, "tipo_trabajo")}::boolean THEN ${b.tipo_trabajo ?? null} ELSE tipo_trabajo END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng,
        direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
    `;

    if (!updated) return NO_ENCONTRADO();

    return NextResponse.json({ taller: updated });
  } catch (error) {
    console.error("Error al actualizar taller:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el taller" },
      { status: 500 },
    );
  }
}

// DELETE /api/talleres/[id] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!esIdValido(id)) return NO_ENCONTRADO();

    // Antes de borrar el taller, "desvinculamos" sus productos y entrevistas
    // (taller_id = NULL) para que no queden apuntando a un taller que ya no
    // existe. sql.transaction ejecuta todo junto: o se aplican las 3
    // consultas, o ninguna.
    const [, , deleted] = await sql.transaction([
      sql`UPDATE products SET taller_id = NULL WHERE taller_id = ${id}`,
      sql`UPDATE entrevistas SET taller_id = NULL WHERE taller_id = ${id}`,
      sql`DELETE FROM talleres WHERE id = ${id} RETURNING id`,
    ]);

    if (deleted.length === 0) return NO_ENCONTRADO();

    return NextResponse.json({
      message: "Taller eliminado",
      id: deleted[0].id,
    });
  } catch (error) {
    console.error("Error al eliminar taller:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el taller" },
      { status: 500 },
    );
  }
}
