"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Botón reutilizable para borrar cualquier recurso. Pide confirmación,
// llama al endpoint DELETE y refresca la lista.
export default function BotonEliminar({ endpoint, nombre }) {
  const router = useRouter();
  const [borrando, setBorrando] = useState(false);

  async function eliminar() {
    // confirm() muestra la ventanita nativa del navegador "¿Aceptar / Cancelar?"
    if (
      !window.confirm(
        `¿Seguro que quieres eliminar "${nombre}"? No se puede deshacer.`,
      )
    ) {
      return;
    }

    setBorrando(true);
    const res = await fetch(endpoint, { method: "DELETE" }).catch(() => null);
    setBorrando(false);

    if (!res?.ok) {
      const data = await res?.json().catch(() => ({}));
      window.alert(data?.error || "No se pudo eliminar");
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={eliminar}
      disabled={borrando}
      aria-label={`Eliminar ${nombre}`}
      className="flex items-center gap-1 text-sm text-red-700 hover:underline disabled:opacity-50"
    >
      <Trash2 size={16} />
      {borrando ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
