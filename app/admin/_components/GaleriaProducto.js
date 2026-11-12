"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import SubirImagen from "./SubirImagen";

// Administra las fotos de un producto (tabla product_images).
// La primera foto (menor "orden") es la que se ve en el mercado.
export default function GaleriaProducto({ productId, imagenesIniciales }) {
  const [imagenes, setImagenes] = useState(imagenesIniciales);
  const [error, setError] = useState("");
  const base = `/api/products/${productId}/images`;

  async function agregar(url) {
    setError("");
    const siguienteOrden = imagenes.length
      ? Math.max(...imagenes.map((i) => i.orden)) + 1
      : 0;
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: url, orden: siguienteOrden }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "No se pudo guardar la foto");
    setImagenes((lista) => [...lista, data.image]);
  }

  async function eliminar(img) {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    const res = await fetch(`${base}/${img.id}`, { method: "DELETE" });
    if (!res.ok) return setError("No se pudo eliminar la foto");
    setImagenes((lista) => lista.filter((i) => i.id !== img.id));
  }

  // Mover una foto a la izquierda/derecha = intercambiar su "orden" con la vecina.
  async function mover(indice, direccion) {
    const otro = indice + direccion;
    if (otro < 0 || otro >= imagenes.length) return;

    const a = imagenes[indice];
    const b = imagenes[otro];
    // Si tenían el mismo orden (datos antiguos), usamos la posición como orden.
    const ordenA = a.orden === b.orden ? otro : b.orden;
    const ordenB = a.orden === b.orden ? indice : a.orden;

    const anterior = imagenes;
    const nueva = [...imagenes];
    nueva[indice] = { ...b, orden: ordenB };
    nueva[otro] = { ...a, orden: ordenA };
    setImagenes(nueva);

    const respuestas = await Promise.all([
      fetch(`${base}/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden: ordenA }),
      }),
      fetch(`${base}/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden: ordenB }),
      }),
    ]).catch(() => []);

    if (respuestas.length !== 2 || !respuestas.every((r) => r.ok)) {
      setImagenes(anterior);
      setError("No se pudo cambiar el orden");
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Fotos del producto</h2>
      <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
        La primera foto es la portada que se ve en el mercado. Usa las flechas
        para reordenar.
      </p>

      {imagenes.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
          Este producto todavía no tiene fotos.
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagenes.map((img, i) => (
            <li key={img.id} className="flex flex-col gap-2">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                <Image
                  src={img.image_url}
                  alt={`Foto ${i + 1}`}
                  unoptimized
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {i === 0 && (
                  <span
                    className="absolute top-1 left-1 text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: "var(--madera)" }}
                  >
                    Portada
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    aria-label="Mover a la izquierda"
                    className="p-1 border rounded disabled:opacity-30"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(i, 1)}
                    disabled={i === imagenes.length - 1}
                    aria-label="Mover a la derecha"
                    className="p-1 border rounded disabled:opacity-30"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => eliminar(img)}
                  aria-label="Eliminar foto"
                  className="p-1 text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SubirImagen texto="Agregar foto" onSubida={agregar} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </section>
  );
}
