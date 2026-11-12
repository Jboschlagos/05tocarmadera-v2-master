"use client";

import dynamic from "next/dynamic";

// Leaflet usa `window`, que no existe en el servidor. Por eso cargamos el
// mapa solo en el navegador (ssr: false) y mostramos un aviso mientras tanto.
const MapaInner = dynamic(() => import("./MapaInner"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center rounded-xl"
      style={{ height: "300px", backgroundColor: "var(--gris-claro)" }}
    >
      <p style={{ color: "var(--gris-texto)" }}>Cargando mapa...</p>
    </div>
  ),
});

export default function Mapa(props) {
  return <MapaInner {...props} />;
}
