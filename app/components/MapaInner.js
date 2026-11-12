"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";

// Fix: Next.js/webpack rompe las rutas de los íconos por defecto de Leaflet.
// Usamos los íconos desde un CDN en vez de copiarlos a /public.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Botón que centra el mapa para que se vean todos los marcadores.
function BotonCentrar({ puntos }) {
  const map = useMap();

  function centrar() {
    if (puntos.length === 0) return;
    const bounds = puntos.map((p) => [Number(p.lat), Number(p.lng)]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }

  return (
    <button
      type="button"
      onClick={centrar}
      title="Centrar mapa"
      aria-label="Centrar mapa"
      className="absolute top-3 right-3 z-[1000] bg-white rounded-lg p-2 shadow-md hover:bg-gray-100 transition-colors"
    >
      <Locate size={20} color="#1a1a1a" />
    </button>
  );
}

// Corrige el tamaño del mapa cuando su contenedor cambia de tamaño
// (por ejemplo, al mostrarlo con el botón "Ver mapa" en mobile, donde
// estaba oculto con display:none y Leaflet lo calculó mal al crearse).
function CorregirTamano() {
  const map = useMap();

  useEffect(() => {
    const contenedor = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(contenedor);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

// ─────────────────────────────────────────────────────────────
// Mapa GENÉRICO: antes había dos archivos casi idénticos (uno para
// talleres y otro para productos). Ahora hay uno solo, y lo único que
// cambia entre ambos usos es QUÉ se muestra dentro del popup.
// Eso lo decide quien usa el mapa, pasando la función `renderPopup`.
// A este patrón se le llama "composición" (o "render prop").
// ─────────────────────────────────────────────────────────────
export default function MapaInner({
  puntos,
  renderPopup,
  center,
  zoom = 5,
  height = "500px",
}) {
  const conUbicacion = puntos.filter((p) => p.lat && p.lng);

  const centroMapa =
    center ||
    (conUbicacion.length > 0
      ? [Number(conUbicacion[0].lat), Number(conUbicacion[0].lng)]
      : [-33.45, -70.66]); // Santiago por defecto

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={centroMapa}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height, width: "100%", borderRadius: "0.75rem", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <BotonCentrar puntos={conUbicacion} />
        <CorregirTamano />
        {conUbicacion.map((p) => (
          <Marker key={p.id} position={[Number(p.lat), Number(p.lng)]}>
            {renderPopup && <Popup>{renderPopup(p)}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
