"use client";

// ─────────────────────────────────────────────────────────────
// Por qué este botón vive en su propio archivo:
// La página /mercado/[id] es un Server Component (se ejecuta en el
// servidor y consulta la base de datos). Los Server Components NO
// pueden tener onClick, useState, etc., porque eso ocurre en el
// navegador. La solución es "aislar" la parte interactiva en un
// componente pequeño con "use client" y usarlo dentro de la página.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function AgregarAlCarrito({ productId }) {
  const { status } = useSession();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
  const [estado, setEstado] = useState("idle"); // idle | cargando | listo | error
  const [mensaje, setMensaje] = useState("");

  async function agregar() {
    // Si no hay sesión, mandamos a login y volvemos a este producto después.
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/mercado/${productId}`);
      return;
    }

    setEstado("cargando");
    setMensaje("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: cantidad }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEstado("error");
        setMensaje(data.error || "No se pudo agregar al carrito");
        return;
      }

      setEstado("listo");
    } catch {
      setEstado("error");
      setMensaje("Error de conexión, intenta de nuevo");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label htmlFor="cantidad" className="text-sm">
          Cantidad
        </label>
        <input
          id="cantidad"
          type="number"
          min={1}
          max={99}
          value={cantidad}
          onChange={(e) =>
            setCantidad(Math.min(99, Math.max(1, Number(e.target.value) || 1)))
          }
          className="w-20 border rounded-lg px-3 py-2"
        />
      </div>

      <button
        type="button"
        onClick={agregar}
        disabled={estado === "cargando"}
        className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white font-semibold disabled:opacity-60"
        style={{ backgroundColor: "var(--madera)" }}
      >
        <ShoppingCart size={18} />
        {estado === "cargando" ? "Agregando..." : "Agregar al carrito"}
      </button>

      {estado === "listo" && (
        <p className="text-sm text-green-700">
          ¡Agregado!{" "}
          <Link href="/carrito" className="underline font-semibold">
            Ver carrito
          </Link>
        </p>
      )}
      {estado === "error" && <p className="text-sm text-red-600">{mensaje}</p>}
    </div>
  );
}
