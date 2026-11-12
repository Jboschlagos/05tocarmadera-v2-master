import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CarritoCliente from "./CarritoCliente";

export const metadata = {
  title: "Mi carrito | Tocar Madera",
};

// Esta parte corre en el servidor: si no hay sesión, ni siquiera mostramos
// la página y mandamos al login. La lista del carrito (que cambia al
// sumar/restar/eliminar) vive en un componente cliente.
export default async function CarritoPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/carrito");
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Mi carrito</h1>
      <CarritoCliente />
    </main>
  );
}
