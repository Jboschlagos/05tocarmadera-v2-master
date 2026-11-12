"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setError("No se pudo procesar la solicitud, intenta de nuevo");
        setCargando(false);
        return;
      }

      // No importa si el correo existe o no en el sistema — siempre
      // mostramos el mismo mensaje de éxito, por seguridad.
      setEnviado(true);
      setCargando(false);
    } catch {
      setError("Error de conexión, intenta de nuevo");
      setCargando(false);
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Recuperar contraseña
        </h1>

        {enviado ? (
          <div className="flex flex-col gap-4">
            <p style={{ color: "var(--oscuro)" }}>
              Si el correo <strong>{email}</strong> está registrado, te enviamos
              un link para restablecer tu contraseña. Revisa tu bandeja de
              entrada (y la carpeta de spam, por si acaso).
            </p>
            <Link
              href="/login"
              className="underline"
              style={{ color: "var(--madera)" }}
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8" style={{ color: "var(--gris-texto)" }}>
              Ingresa tu correo y te enviaremos un link para crear una
              contraseña nueva.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email
                </label>
                <input
                  id="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={cargando}
                className="rounded-lg px-4 py-2 text-white font-semibold"
                style={{ backgroundColor: "var(--madera)" }}
              >
                {cargando ? "Enviando..." : "Enviar link de recuperación"}
              </button>
            </form>

            <p className="text-sm mt-4" style={{ color: "var(--gris-texto)" }}>
              ¿Recordaste tu contraseña?{" "}
              <Link href="/login" className="underline">
                Inicia sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
