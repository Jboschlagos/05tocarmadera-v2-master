"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo restablecer la contraseña");
        setCargando(false);
        return;
      }

      setExito(true);
      setCargando(false);
    } catch {
      setError("Error de conexión, intenta de nuevo");
      setCargando(false);
    }
  }

  // Si alguien llega a esta página sin token (por ejemplo, escribiendo
  // la URL a mano), no tiene sentido mostrarle el formulario.
  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p style={{ color: "var(--oscuro)" }}>
          Este link no es válido. Solicita uno nuevo desde la página de
          recuperación.
        </p>
        <Link
          href="/forgot-password"
          className="underline"
          style={{ color: "var(--madera)" }}
        >
          Ir a recuperar contraseña
        </Link>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p style={{ color: "var(--oscuro)" }}>
          Tu contraseña fue actualizada correctamente.
        </p>
        <Link
          href="/login"
          className="underline"
          style={{ color: "var(--madera)" }}
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="password" className="block text-sm mb-1">
          Contraseña nueva
        </label>
        <input
          id="password"
          autoComplete="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm mb-1">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          autoComplete="new-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
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
        {cargando ? "Guardando..." : "Guardar contraseña nueva"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Restablecer contraseña
        </h1>
        <Suspense fallback={<p>Cargando...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
