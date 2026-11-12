"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

// Sube un archivo a /api/upload (que lo manda a Cloudinary) y devuelve la URL
// pública con la función onSubida(url).
//
// Para mandar un ARCHIVO no se usa JSON: se usa FormData, el mismo formato
// que usa un <form> HTML normal con enctype="multipart/form-data".
export async function subirArchivo(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen");
  return data.image_url;
}

export default function SubirImagen({ onSubida, texto = "Subir imagen" }) {
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function alElegir(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSubiendo(true);
    try {
      const url = await subirArchivo(file);
      onSubida(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
      e.target.value = ""; // permite volver a elegir el mismo archivo
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {/* El input de archivo real queda oculto; el botón lo "clickea" por nosotros. */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={alElegir}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={subiendo}
        className="self-start flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-white hover:bg-stone-50 disabled:opacity-60"
      >
        <Upload size={16} />
        {subiendo ? "Subiendo..." : texto}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
