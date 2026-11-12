import Link from "next/link";
import { Plus } from "lucide-react";

// Título de la lista + botón "Nuevo ...". Lo comparten las 3 listas del panel.
export default function EncabezadoLista({ titulo, nuevoHref, nuevoTexto }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 className="text-3xl font-bold">{titulo}</h1>
      <Link
        href={nuevoHref}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-white font-semibold"
        style={{ backgroundColor: "var(--madera)" }}
      >
        <Plus size={18} /> {nuevoTexto}
      </Link>
    </div>
  );
}
