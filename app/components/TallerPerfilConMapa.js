"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, X, Phone, MessageCircle, Globe, Home } from "lucide-react";
import TallerMap from "./TallerMap";

export default function TallerPerfilConMapa({
  taller,
  productos,
  entrevistas,
}) {
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const tieneUbicacion = taller.lat && taller.lng;

  const tieneContacto =
    taller.direccion ||
    taller.telefono ||
    taller.whatsapp_url ||
    taller.sitio_web;

  return (
    <>
      {tieneUbicacion && (
        <button
          type="button"
          onClick={() => setMostrarMapa((v) => !v)}
          className="lg:hidden flex items-center justify-center gap-2 rounded-lg px-4 py-3 mb-6 font-semibold text-white w-full"
          style={{ backgroundColor: "var(--madera)" }}
        >
          {mostrarMapa ? <X size={18} /> : <MapPin size={18} />}
          {mostrarMapa ? "Ocultar mapa" : "Ver mapa"}
        </button>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {tieneUbicacion && (
          <div
            className={`${mostrarMapa ? "block" : "hidden"} lg:block lg:order-2 lg:w-[380px] lg:shrink-0`}
          >
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold mb-4">Ubicación del taller</h2>
              <TallerMap
                talleres={[taller]}
                center={[Number(taller.lat), Number(taller.lng)]}
                zoom={12}
                height="300px"
              />
            </div>
          </div>
        )}

        <div className="flex-1 lg:order-1">
          <div className="flex flex-col items-center text-center mb-10">
            {taller.foto_url ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={taller.foto_url}
                  alt={taller.nombre}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            ) : (
              <div
                className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: "var(--madera)" }}
              >
                {taller.nombre.charAt(0)}
              </div>
            )}
            <h1 className="text-3xl font-bold">{taller.nombre}</h1>
            <p className="text-lg" style={{ color: "var(--madera)" }}>
              {taller.oficio}
            </p>
            {taller.tipo_trabajo && (
              <span
                className="mt-2 text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--madera)", color: "white" }}
              >
                {taller.tipo_trabajo}
              </span>
            )}
            <p className="text-sm mt-2" style={{ color: "var(--gris-texto)" }}>
              📍 {[taller.ciudad, taller.region].filter(Boolean).join(", ")}
            </p>
            {taller.instagram_url && (
              <a
                href={taller.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline mt-2"
                style={{ color: "var(--madera)" }}
              >
                Ver en Instagram
              </a>
            )}
          </div>

          {taller.bio && (
            <p
              className="mb-10 text-center max-w-2xl mx-auto"
              style={{ color: "var(--oscuro)" }}
            >
              {taller.bio}
            </p>
          )}

          {tieneContacto && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Contacto</h2>
              <div className="flex flex-col gap-2">
                {taller.direccion && (
                  <p
                    className="flex items-center gap-2"
                    style={{ color: "var(--oscuro)" }}
                  >
                    <Home size={16} style={{ color: "var(--madera)" }} />
                    {taller.direccion}
                  </p>
                )}
                {taller.telefono && (
                  <p
                    className="flex items-center gap-2"
                    style={{ color: "var(--oscuro)" }}
                  >
                    <Phone size={16} style={{ color: "var(--madera)" }} />
                    {taller.telefono}
                  </p>
                )}
                {taller.whatsapp_url && (
                  <a
                    href={taller.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 underline"
                    style={{ color: "var(--madera)" }}
                  >
                    <MessageCircle size={16} />
                    Escríbeme por WhatsApp
                  </a>
                )}
                {taller.sitio_web && (
                  <a
                    href={taller.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 underline"
                    style={{ color: "var(--madera)" }}
                  >
                    <Globe size={16} />
                    Sitio web
                  </a>
                )}
              </div>
            </section>
          )}

          {taller.tecnica && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Técnicas y materiales</h2>
              <p style={{ color: "var(--oscuro)" }}>{taller.tecnica}</p>
            </section>
          )}

          {entrevistas.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Entrevistas</h2>
              <div className="flex flex-col gap-2">
                {entrevistas.map((e) => (
                  <Link
                    key={e.id}
                    href={`/entrevistas/${e.id}`}
                    className="underline"
                    style={{ color: "var(--madera)" }}
                  >
                    {e.titulo}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {productos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Productos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {productos.map((p) => (
                  <Link
                    key={p.id}
                    href={`/mercado/${p.id}`}
                    className="rounded-xl p-4 shadow-sm"
                    style={{ backgroundColor: "var(--gris-claro)" }}
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm" style={{ color: "var(--madera)" }}>
                      ${Number(p.price).toLocaleString("es-CL")}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
