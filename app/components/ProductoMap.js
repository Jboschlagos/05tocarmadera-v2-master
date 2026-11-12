"use client";

import Link from "next/link";
import Mapa from "./Mapa";

// Qué se ve al hacer clic en el marcador de un producto.
function PopupProducto(p) {
  return (
    <div style={{ textAlign: "center", minWidth: "140px" }}>
      <p style={{ fontWeight: "bold", margin: 0 }}>{p.name}</p>
      {p.taller_nombre && (
        <p
          style={{ fontSize: "0.8rem", color: "#6b6b6b", margin: "2px 0 6px" }}
        >
          {p.taller_nombre}
        </p>
      )}
      <Link
        href={`/mercado/${p.id}`}
        style={{
          color: "#8b5e3c",
          textDecoration: "underline",
          fontSize: "0.85rem",
        }}
      >
        Ver producto
      </Link>
    </div>
  );
}

// Mapa de productos = mapa genérico + popup de producto.
export default function ProductoMap({ productos, ...resto }) {
  return <Mapa puntos={productos} renderPopup={PopupProducto} {...resto} />;
}
