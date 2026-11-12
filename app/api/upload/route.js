import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const TAMANO_MAXIMO_MB = 8;

// POST /api/upload — solo admin
export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    // typeof file === "string" pasaría si alguien manda texto en vez de archivo.
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No se recibió ningún archivo (campo 'file')" },
        { status: 400 },
      );
    }

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes (JPG, PNG, WEBP, AVIF o GIF)" },
        { status: 400 },
      );
    }

    if (file.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `La imagen no puede pesar más de ${TAMANO_MAXIMO_MB} MB` },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "tocarmadera",
    });

    return NextResponse.json(
      { image_url: result.secure_url, public_id: result.public_id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen" },
      { status: 500 },
    );
  }
}
