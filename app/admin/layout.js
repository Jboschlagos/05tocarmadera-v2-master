import Link from "next/link";
import { verificarAdminPagina } from "@/lib/requireAdmin";

export const metadata = {
  title: "Panel de administración | Tocar Madera",
  robots: { index: false }, // que Google no indexe el panel
};

// El panel siempre muestra datos frescos de la base.
export const dynamic = "force-dynamic";

const secciones = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/talleres", label: "Talleres" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/entrevistas", label: "Entrevistas" },
];

// Un layout envuelve a todas las páginas de su carpeta: aquí, todo /admin/*
// comparte este menú lateral.
export default async function AdminLayout({ children }) {
  await verificarAdminPagina();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row gap-8">
      <aside className="md:w-48 shrink-0">
        <p
          className="text-xs uppercase tracking-wide mb-3"
          style={{ color: "var(--gris-texto)" }}
        >
          Panel admin
        </p>
        <nav className="flex md:flex-col gap-2 flex-wrap">
          {secciones.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-800"
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
