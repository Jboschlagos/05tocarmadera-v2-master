import { neon } from "@neondatabase/serverless";

// Reutiliza la misma conexión en toda la app.
// DATABASE_URL debe existir en tu .env.local (ya lo tienes configurado).
export const sql = neon(process.env.DATABASE_URL);
