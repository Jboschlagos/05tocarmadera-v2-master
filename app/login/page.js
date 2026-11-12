"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Solo aceptamos rutas internas ("/carrito"), nunca una URL externa
// ("https://sitio-malo.com"). Si no, alguien podría armar un link de login
// que, después de ingresar, te mande a un sitio falso ("open redirect").
function destinoSeguro(url) {
  return url && url.startsWith("/") && !url.startsWith("//") ? url : "/";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destino = destinoSeguro(searchParams.get("callbackUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setCargando(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    router.push(destino);
    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          {/* htmlFor + id conectan la etiqueta con su input: al hacer clic en
              "Email" se enfoca el campo, y los lectores de pantalla lo anuncian. */}
          <label htmlFor="email" className="block text-sm mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="rounded-lg px-4 py-2 text-white font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--madera)" }}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="text-sm mt-4" style={{ color: "var(--gris-texto)" }}>
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="underline">
          Regístrate
        </Link>
      </p>

      <p className="text-sm mt-2" style={{ color: "var(--gris-texto)" }}>
        <Link href="/forgot-password" className="underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </>
  );
}

// useSearchParams necesita estar dentro de <Suspense> en Next.js
// (igual que ya lo tenías en reset-password).
export default function LoginPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Iniciar sesión</h1>
        <Suspense fallback={<p>Cargando...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
