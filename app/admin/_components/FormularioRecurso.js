"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { RECURSOS, extraerYoutubeId } from "./recursos";
import SubirImagen from "./SubirImagen";

// Convierte lo que viene de la base (null, números) en texto para los <input>.
// Los inputs de React deben recibir siempre un string, nunca null/undefined.
function valoresIniciales(campos, registro) {
  const valores = {};
  for (const campo of campos) {
    const v = registro?.[campo.nombre];
    valores[campo.nombre] = v === null || v === undefined ? "" : String(v);
  }
  return valores;
}

// Lo contrario: de los textos del formulario al JSON que espera la API.
// - "" se manda como null (campo vacío)
// - números y taller_id se mandan como Number
// - el campo de YouTube acepta un link completo y se queda solo con el ID
function armarBody(campos, valores) {
  const body = {};
  for (const campo of campos) {
    const v = valores[campo.nombre].trim();
    if (v === "") {
      body[campo.nombre] = null;
    } else if (campo.tipo === "numero" || campo.tipo === "taller") {
      body[campo.nombre] = Number(v);
    } else if (campo.tipo === "youtube") {
      body[campo.nombre] = extraerYoutubeId(v);
    } else {
      body[campo.nombre] = v;
    }
  }
  return body;
}

const claseInput = "w-full border rounded-lg px-3 py-2 bg-white";

export default function FormularioRecurso({
  recurso,
  registro,
  talleres = [],
}) {
  const config = RECURSOS[recurso];
  const router = useRouter();
  const esEdicion = Boolean(registro?.id);

  const [valores, setValores] = useState(() =>
    valoresIniciales(config.campos, registro),
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // Un solo manejador para todos los campos: usa el nombre del campo como clave.
  function cambiar(nombre, valor) {
    setValores((v) => ({ ...v, [nombre]: valor }));
    setGuardado(false);
  }

  async function guardar(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const url = esEdicion
      ? `${config.endpoint}/${registro.id}`
      : config.endpoint;

    try {
      const res = await fetch(url, {
        method: esEdicion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(armarBody(config.campos, valores)),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo guardar");
        return;
      }

      const guardadoNuevo = data[config.claveRespuesta];

      if (!esEdicion && config.editarDespuesDeCrear) {
        router.push(`${config.rutaLista}/${guardadoNuevo.id}`);
      } else if (!esEdicion) {
        router.push(config.rutaLista);
      } else {
        setGuardado(true);
      }
      // refresh() vuelve a pedir los datos de las páginas del servidor,
      // para que la lista muestre los cambios recién guardados.
      router.refresh();
    } catch {
      setError("Error de conexión, intenta de nuevo");
    } finally {
      setGuardando(false);
    }
  }

  function dibujarCampo(campo) {
    const id = `campo-${campo.nombre}`;
    const valor = valores[campo.nombre];
    const comunes = {
      id,
      value: valor,
      required: campo.obligatorio,
      onChange: (e) => cambiar(campo.nombre, e.target.value),
      className: claseInput,
    };

    switch (campo.tipo) {
      case "textarea":
        return <textarea {...comunes} rows={5} />;
      case "numero":
        return <input {...comunes} type="number" step="any" />;
      case "fecha":
        return <input {...comunes} type="date" />;
      case "url":
        return <input {...comunes} type="url" placeholder="https://..." />;
      case "taller":
        return (
          <select {...comunes}>
            <option value="">— Sin taller —</option>
            {talleres.map((t) => (
              <option key={t.id} value={String(t.id)}>
                {t.nombre}
              </option>
            ))}
          </select>
        );
      case "imagen":
        return (
          <div className="flex flex-col gap-2">
            {valor && (
              <div className="relative w-40 h-28 rounded-lg overflow-hidden border">
                <Image
                  src={valor}
                  alt="Vista previa"
                  unoptimized
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <SubirImagen
                texto={valor ? "Cambiar imagen" : "Subir imagen"}
                onSubida={(url) => cambiar(campo.nombre, url)}
              />
              {valor && (
                <button
                  type="button"
                  onClick={() => cambiar(campo.nombre, "")}
                  className="text-sm underline text-red-700"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>
        );
      default:
        return <input {...comunes} type="text" />;
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-5 max-w-2xl">
      {config.campos.map((campo) => (
        <div key={campo.nombre}>
          {/* Los campos de imagen no tienen un input "enfocable", así que
              ahí la etiqueta va sin htmlFor. */}
          <label
            htmlFor={
              campo.tipo === "imagen" ? undefined : `campo-${campo.nombre}`
            }
            className="block text-sm font-semibold mb-1"
          >
            {campo.etiqueta}
            {campo.obligatorio && <span className="text-red-600"> *</span>}
          </label>
          {dibujarCampo(campo)}
          {campo.ayuda && (
            <p className="text-xs mt-1" style={{ color: "var(--gris-texto)" }}>
              {campo.ayuda}
            </p>
          )}
        </div>
      ))}

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {guardado && (
        <p className="text-green-700 text-sm">Cambios guardados ✔</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-lg px-6 py-2 text-white font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--madera)" }}
        >
          {guardando
            ? "Guardando..."
            : esEdicion
              ? "Guardar cambios"
              : `Crear ${config.singular}`}
        </button>
        <Link href={config.rutaLista} className="underline text-sm">
          Volver a la lista
        </Link>
      </div>
    </form>
  );
}
