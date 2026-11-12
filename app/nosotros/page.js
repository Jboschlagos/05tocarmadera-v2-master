import Carousel from "@/app/components/Carousel";

export const metadata = {
  title: "Nuestra Historia | Tocar Madera",
};

const imagenes = [
  "/img/carrusel/01.jpg",
  "/img/carrusel/02.jpg",
  "/img/carrusel/03.jpg",
  "/img/carrusel/04.jpg",
  "/img/carrusel/05.jpg",
];

export default function NosotrosPage() {
  return (
    <main className="max-w-4xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Nuestra Historia</h1>

      <Carousel images={imagenes} />

      <div
        className="mt-10 flex flex-col gap-4"
        style={{ color: "var(--oscuro)" }}
      >
        <p>
          Tocar Madera nace de una idea simple: la madera chilena tiene
          historias que merecen ser contadas. Detrás de cada mesa, cada silla y
          cada pieza tallada hay un artesano con años de oficio, técnicas
          heredadas y un vínculo profundo con los bosques y las tradiciones de
          su región.
        </p>
        <p>
          Este proyecto busca conectar a esos artesanos con personas que valoran
          el trabajo hecho a mano, creando un mercado colaborativo donde comprar
          una pieza de madera también signifique conocer quién la hizo y cómo.
        </p>
        <p>
          Desde Arica hasta la Patagonia, reunimos carpinteros, talladores y
          constructores que mantienen vivo un oficio que combina tradición,
          creatividad y respeto por la materia prima.
        </p>
      </div>
    </main>
  );
}
