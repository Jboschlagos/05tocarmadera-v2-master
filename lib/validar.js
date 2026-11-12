// Pequeñas funciones de validación que reutilizamos en la API y en las páginas.
// Tenerlas en un solo lugar evita repetir la misma lógica en cada archivo.

// Un id válido es un número entero positivo escrito solo con dígitos ("12").
// Si alguien entra a /talleres/abc, esto devuelve false y podemos responder
// 404 en vez de dejar que Postgres lance un error (que terminaría en 500).
export function esIdValido(id) {
  return /^\d+$/.test(String(id ?? ""));
}

// Emails siempre en minúscula y sin espacios: así "Jorge@X.cl " y
// "jorge@x.cl" se consideran el mismo correo.
export function normalizarEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

// true si el objeto trae esa propiedad (aunque su valor sea null).
// Lo usamos en los PUT para distinguir "no mandaste este campo" (no tocarlo)
// de "lo mandaste vacío" (borrarlo).
export function viene(body, campo) {
  return Object.prototype.hasOwnProperty.call(body ?? {}, campo);
}

export const LARGO_MINIMO_PASSWORD = 6;

// Máximo de unidades de un mismo producto en el carrito.
export const CANTIDAD_MAXIMA = 99;
