"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  function anterior() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function siguiente() {
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden">
      <Image
        src={images[index]}
        alt={`Nuestra historia ${index + 1}`}
        fill
        className="object-cover transition-opacity duration-500"
        sizes="100vw"
        priority={index === 0}
      />

      <button
        type="button"
        onClick={anterior}
        aria-label="Imagen anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={siguiente}
        aria-label="Imagen siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            aria-current={i === index}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                i === index ? "var(--madera)" : "rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
