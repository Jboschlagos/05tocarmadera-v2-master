"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

const formatoPeso = (n) => `$${Number(n).toLocaleString("es-CL")}`;

export default function CarritoCliente() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Al montar el componente pedimos el carrito a la API.
  useEffect(() => {
    let cancelado = false; // evita actualizar estado si el usuario ya se fue de la página

    fetch("/api/cart")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (cancelado) return;
        if (!ok) setError(data.error || "No se pudo cargar el carrito");
        else setItems(data.items);
      })
      .catch(() => !cancelado && setError("Error de conexión"))
      .finally(() => !cancelado && setCargando(false));

    return () => {
      cancelado = true;
    };
  }, []);

  async function cambiarCantidad(item, nueva) {
    if (nueva < 1 || nueva > 99) return;
    const anterior = items;

    // "Actualización optimista": cambiamos la pantalla al tiro y, si la API
    // falla, volvemos al estado anterior. Así la app se siente rápida.
    setItems((lista) =>
      lista.map((i) => (i.id === item.id ? { ...i, quantity: nueva } : i)),
    );

    const res = await fetch(`/api/cart/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: nueva }),
    }).catch(() => null);

    if (!res?.ok) {
      setItems(anterior);
      setError("No se pudo actualizar la cantidad");
    }
  }

  async function eliminar(item) {
    const anterior = items;
    setItems((lista) => lista.filter((i) => i.id !== item.id));

    const res = await fetch(`/api/cart/${item.id}`, { method: "DELETE" }).catch(
      () => null,
    );
    if (!res?.ok) {
      setItems(anterior);
      setError("No se pudo eliminar el producto");
    }
  }

  if (cargando)
    return <p style={{ color: "var(--gris-texto)" }}>Cargando carrito...</p>;

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <p style={{ color: "var(--gris-texto)" }}>Tu carrito está vacío.</p>
        <Link
          href="/mercado"
          className="underline"
          style={{ color: "var(--madera)" }}
        >
          Ir al mercado
        </Link>
      </div>
    );
  }

  // reduce recorre la lista acumulando un valor: aquí, el total en pesos.
  const total = items.reduce(
    (suma, i) => suma + Number(i.price) * i.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-xl p-4"
            style={{ backgroundColor: "var(--gris-claro)" }}
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/mercado/${item.product_id}`}
                className="font-semibold hover:underline"
              >
                {item.name}
              </Link>
              <p className="text-sm" style={{ color: "var(--madera)" }}>
                {formatoPeso(item.price)} c/u
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => cambiarCantidad(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Restar una unidad de ${item.name}`}
                className="p-1 rounded border bg-white disabled:opacity-40"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center" aria-live="polite">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => cambiarCantidad(item, item.quantity + 1)}
                disabled={item.quantity >= 99}
                aria-label={`Sumar una unidad de ${item.name}`}
                className="p-1 rounded border bg-white disabled:opacity-40"
              >
                <Plus size={16} />
              </button>
            </div>

            <p className="w-24 text-right font-semibold hidden sm:block">
              {formatoPeso(Number(item.price) * item.quantity)}
            </p>

            <button
              type="button"
              onClick={() => eliminar(item)}
              aria-label={`Eliminar ${item.name} del carrito`}
              className="p-2 text-red-700 hover:bg-red-50 rounded"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-lg font-bold">Total</p>
        <p className="text-2xl font-bold" style={{ color: "var(--madera)" }}>
          {formatoPeso(total)}
        </p>
      </div>

      <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
        El pago en línea todavía no está disponible. Pronto podrás finalizar tu
        compra aquí.
      </p>
    </div>
  );
}
