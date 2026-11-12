// ─────────────────────────────────────────────────────────────
// Configuración de los formularios del panel.
//
// En vez de escribir 3 formularios casi iguales (talleres, productos,
// entrevistas), describimos aquí QUÉ campos tiene cada uno, y un solo
// componente (FormularioRecurso) se encarga de dibujarlos. Si mañana
// agregas una columna nueva a la base, solo sumas una línea aquí.
//
// Tipos de campo disponibles:
//   texto, textarea, numero, fecha, url, imagen, taller, youtube
//
// (La carpeta se llama "_components" con guion bajo: en Next.js eso la
// marca como privada, o sea, NO se convierte en una ruta /admin/_components.)
// ─────────────────────────────────────────────────────────────

export const RECURSOS = {
  talleres: {
    singular: "taller",
    endpoint: "/api/talleres",
    claveRespuesta: "taller",
    rutaLista: "/admin/talleres",
    campos: [
      {
        nombre: "nombre",
        etiqueta: "Nombre del taller",
        tipo: "texto",
        obligatorio: true,
      },
      {
        nombre: "oficio",
        etiqueta: "Oficio",
        tipo: "texto",
        ayuda: "Ej: Carpintero mueblista",
      },
      {
        nombre: "tipo_trabajo",
        etiqueta: "Tipo de trabajo",
        tipo: "texto",
        ayuda: "Ej: Muebles a medida",
      },
      { nombre: "bio", etiqueta: "Biografía", tipo: "textarea" },
      {
        nombre: "tecnica",
        etiqueta: "Técnicas y materiales",
        tipo: "textarea",
      },
      { nombre: "foto_url", etiqueta: "Foto del taller", tipo: "imagen" },
      { nombre: "ciudad", etiqueta: "Ciudad", tipo: "texto" },
      { nombre: "region", etiqueta: "Región", tipo: "texto" },
      {
        nombre: "lat",
        etiqueta: "Latitud",
        tipo: "numero",
        ayuda: "Ej: -33.4489 (clic derecho en Google Maps la muestra)",
      },
      {
        nombre: "lng",
        etiqueta: "Longitud",
        tipo: "numero",
        ayuda: "Ej: -70.6693",
      },
      { nombre: "direccion", etiqueta: "Dirección", tipo: "texto" },
      { nombre: "telefono", etiqueta: "Teléfono", tipo: "texto" },
      {
        nombre: "whatsapp_url",
        etiqueta: "Link de WhatsApp",
        tipo: "url",
        ayuda: "Ej: https://wa.me/56912345678",
      },
      { nombre: "instagram_url", etiqueta: "Instagram", tipo: "url" },
      { nombre: "sitio_web", etiqueta: "Sitio web", tipo: "url" },
    ],
  },

  productos: {
    singular: "producto",
    endpoint: "/api/products",
    claveRespuesta: "product",
    rutaLista: "/admin/productos",
    // Al crear un producto nuevo, vamos directo a su edición para que puedas
    // subir las fotos de la galería (necesitan que el producto ya exista).
    editarDespuesDeCrear: true,
    campos: [
      { nombre: "name", etiqueta: "Nombre", tipo: "texto", obligatorio: true },
      {
        nombre: "price",
        etiqueta: "Precio (CLP)",
        tipo: "numero",
        obligatorio: true,
      },
      { nombre: "description", etiqueta: "Descripción", tipo: "textarea" },
      { nombre: "taller_id", etiqueta: "Taller", tipo: "taller" },
      { nombre: "ciudad", etiqueta: "Ciudad", tipo: "texto" },
      { nombre: "region", etiqueta: "Región", tipo: "texto" },
      { nombre: "lat", etiqueta: "Latitud", tipo: "numero" },
      { nombre: "lng", etiqueta: "Longitud", tipo: "numero" },
    ],
  },

  entrevistas: {
    singular: "entrevista",
    endpoint: "/api/entrevistas",
    claveRespuesta: "entrevista",
    rutaLista: "/admin/entrevistas",
    campos: [
      {
        nombre: "titulo",
        etiqueta: "Título",
        tipo: "texto",
        obligatorio: true,
      },
      {
        nombre: "taller_id",
        etiqueta: "Taller vinculado",
        tipo: "taller",
        ayuda: "Opcional: enlaza la entrevista con el perfil del taller",
      },
      {
        nombre: "taller",
        etiqueta: "Nombre del taller (como se mostrará)",
        tipo: "texto",
        obligatorio: true,
      },
      {
        nombre: "oficio",
        etiqueta: "Oficio",
        tipo: "texto",
        obligatorio: true,
      },
      { nombre: "fecha", etiqueta: "Fecha", tipo: "fecha", obligatorio: true },
      {
        nombre: "youtube_id",
        etiqueta: "Video de YouTube",
        tipo: "youtube",
        obligatorio: true,
        ayuda: "Pega el link completo o solo el ID",
      },
      { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
      { nombre: "tecnica", etiqueta: "Técnica", tipo: "textarea" },
      {
        nombre: "imagen_principal",
        etiqueta: "Imagen principal",
        tipo: "imagen",
      },
      { nombre: "instagram_url", etiqueta: "Instagram", tipo: "url" },
      { nombre: "ciudad", etiqueta: "Ciudad", tipo: "texto" },
      { nombre: "region", etiqueta: "Región", tipo: "texto" },
      { nombre: "lat", etiqueta: "Latitud", tipo: "numero" },
      { nombre: "lng", etiqueta: "Longitud", tipo: "numero" },
    ],
  },
};

// Acepta "dQw4w9WgXcQ", "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
// "https://youtu.be/dQw4w9WgXcQ" o ".../shorts/dQw4w9WgXcQ" y devuelve solo el ID.
export function extraerYoutubeId(texto) {
  const valor = String(texto ?? "").trim();
  const match = valor.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : valor;
}
