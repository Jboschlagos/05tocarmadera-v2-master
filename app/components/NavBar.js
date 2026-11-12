"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  BookOpen,
  Users,
  LogIn,
  LogOut,
  Newspaper,
  ShoppingBag,
  ShoppingCart,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/talleres", label: "Talleres", icon: Users },
  { href: "/entrevistas", label: "Entrevistas", icon: Newspaper },
  { href: "/nosotros", label: "Nuestra Historia", icon: BookOpen },
  { href: "/mercado", label: "Mercado", icon: ShoppingBag },
];

const claseLink =
  "text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700";

// Saludo + insignia de admin. Lo usamos en desktop y en mobile, así que
// lo dejamos como componente para no escribirlo dos veces.
function Saludo({ user }) {
  return (
    <span className="text-sm" style={{ color: "var(--gris-texto)" }}>
      Hola, <strong>{user.name}</strong>
      {user.role === "admin" && (
        <span
          className="ml-2 text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "var(--madera)", color: "white" }}
        >
          admin
        </span>
      )}
    </span>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const user = session?.user;

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <nav className="relative flex justify-between items-center px-4 sm:px-8 py-4 shadow-sm bg-white">
      <Link href="/" onClick={cerrarMenu}>
        <Image
          src="/img/logoSinFondo.png"
          alt="Tocar Madera"
          width={80}
          height={80}
          priority
        />
      </Link>

      {/* ── Enlaces — visibles desde md (768px) ─────────── */}
      <div className="hidden md:flex gap-4 lg:gap-8 items-center">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={claseLink}>
            <Icon size={18} /> {label}
          </Link>
        ))}

        {status === "loading" ? null : user ? (
          <div className="flex items-center gap-3">
            <Link href="/carrito" className={claseLink} aria-label="Mi carrito">
              <ShoppingCart size={18} />
            </Link>
            {user.role === "admin" && (
              <Link href="/admin" className={claseLink}>
                <LayoutDashboard size={18} /> Panel
              </Link>
            )}
            <Saludo user={user} />
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className={claseLink}
            >
              <LogOut size={18} /> Salir
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-green-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
          >
            <LogIn size={18} /> Ingresar
          </Link>
        )}
      </div>

      {/* ── Botón hamburguesa — solo visible bajo md ────── */}
      <button
        type="button"
        onClick={() => setMenuAbierto((v) => !v)}
        className="md:hidden text-stone-800 p-2 -mr-2"
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
      >
        {menuAbierto ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* ── Menú desplegable mobile — bajo md ────────────── */}
      {menuAbierto && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md flex flex-col py-2 z-50"
          style={{ borderTop: "1px solid var(--gris-claro)" }}
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={cerrarMenu}
              className="text-stone-800 text-lg flex items-center gap-3 px-6 py-3 transition-all duration-200 hover:text-amber-700 hover:bg-stone-50"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          <div
            className="mt-2 pt-3 px-6"
            style={{ borderTop: "1px solid var(--gris-claro)" }}
          >
            {status === "loading" ? null : user ? (
              <div className="flex flex-col gap-3">
                <Saludo user={user} />
                <Link
                  href="/carrito"
                  onClick={cerrarMenu}
                  className="text-stone-800 text-lg flex items-center gap-2 py-2 hover:text-amber-700"
                >
                  <ShoppingCart size={18} /> Mi carrito
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={cerrarMenu}
                    className="text-stone-800 text-lg flex items-center gap-2 py-2 hover:text-amber-700"
                  >
                    <LayoutDashboard size={18} /> Panel de administración
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    cerrarMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-stone-800 text-lg flex items-center gap-2 py-2 transition-all duration-200 hover:text-amber-700"
                >
                  <LogOut size={18} /> Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={cerrarMenu}
                className="text-green-800 text-lg flex items-center gap-2 py-2 transition-all duration-200 hover:text-amber-700"
              >
                <LogIn size={18} /> Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
