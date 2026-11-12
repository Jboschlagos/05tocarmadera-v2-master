"use client";

import Link from "next/link";
import Image from "next/image";
import Mapa from "./Mapa";

// Qué se ve al hacer clic en el marcador de un taller.
function PopupTaller(t) {
  return (
    <div style={{ textAlign: "center", minWidth: "140px" }}>
      {t.foto_url && (
        <Image
          src={t.foto_url}
          alt={t.nombre}
          width={60}
          height={60}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto 6px",
          }}
        />
      )}
      <p style={{ fontWeight: "bold", margin: 0 }}>{t.nombre}</p>
      <p style={{ fontSize: "0.8rem", color: "#6b6b6b", margin: "2px 0 6px" }}>
        {t.oficio}
      </p>
      <Link
        href={`/talleres/${t.id}`}
        style={{
          color: "#8b5e3c",
          textDecoration: "underline",
          fontSize: "0.85rem",
        }}
      >
        Ver perfil
      </Link>
    </div>
  );
}

// Mapa de talleres = mapa genérico + popup de taller.
export default function TallerMap({ talleres, ...resto }) {
  return <Mapa puntos={talleres} renderPopup={PopupTaller} {...resto} />;
}
