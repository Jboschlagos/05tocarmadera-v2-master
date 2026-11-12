"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, X } from "lucide-react";
import ProductoMap from "./ProductoMap";

export default function ProductosConMapa({ productos }) {
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [region, setRegion] = useState("");
  const [taller, setTaller] = useState("");

  // Opciones de los filtros, sacadas de los mismos productos (sin repetir).
  // useMemo evita recalcularlas en cada render si `productos` no cambió.
  const regiones = useMemo(
    () => [...new Set(productos.map((p) => p.region).filter(Boolean))].sort(),
    [productos],
  );
  const talleres = useMemo(
    () =>
      [
        ...new Set(productos.map((p) => p.taller_nombre).filter(Boolean)),
      ].sort(),
    [productos],
  );

  // Un producto pasa el filtro si coincide con lo elegido (o si no se eligió nada).
  const filtrados = productos.filter(
    (p) =>
      (!region || p.region === region) &&
      (!taller || p.taller_nombre === taller),
  );
  const conUbicacion = filtrados.filter((p) => p.lat && p.lng);

  if (productos.length === 0) {
    return (
      <p style={{ color: "var(--gris-texto)" }}>
        Aún no hay productos publicados.
      </p>
    );
  }

  return (
    <>
      {/* ── Filtros ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-col">
          <label htmlFor="filtro-region" className="text-sm mb-1">
            Región
          </label>
          <select
            id="filtro-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Todas</option>
            {regiones.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="filtro-taller" className="text-sm mb-1">
            Taller
          </label>
          <select
            id="filtro-taller"
            value={taller}
            onChange={(e) => setTaller(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Todos</option>
            {talleres.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {(region || taller) && (
          <button
            type="button"
            onClick={() => {
              setRegion("");
              setTaller("");
            }}
            className="self-start sm:self-end underline text-sm py-2"
            style={{ color: "var(--madera)" }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {conUbicacion.length > 0 && (
          <button
            type="button"
            onClick={() => setMostrarMapa((v) => !v)}
            className="lg:hidden flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white"
            style={{ backgroundColor: "var(--madera)" }}
          >
            {mostrarMapa ? <X size={18} /> : <MapPin size={18} />}
            {mostrarMapa ? "Ocultar mapa" : "Ver mapa"}
          </button>
        )}

        {conUbicacion.length > 0 && (
          <div
            className={`${mostrarMapa ? "block" : "hidden"} lg:block lg:order-2 lg:w-[380px] lg:shrink-0`}
          >
            <div className="lg:sticky lg:top-24">
              <ProductoMap productos={conUbicacion} zoom={5} height="600px" />
            </div>
          </div>
        )}

        <div className="flex-1 lg:order-1">
          {filtrados.length === 0 ? (
            <p style={{ color: "var(--gris-texto)" }}>
              No hay productos con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtrados.map((product) => (
                <Link
                  key={product.id}
                  href={`/mercado/${product.id}`}
                  className="rounded-xl overflow-hidden shadow-sm block hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "white" }}
                >
                  {product.image_url && (
                    <div className="relative w-full h-40">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--madera)" }}
                    >
                      ${Number(product.price).toLocaleString("es-CL")}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--gris-texto)" }}
                    >
                      {[product.ciudad, product.region]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
