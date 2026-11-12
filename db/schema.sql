-- ============================================================
-- Esquema de la base de datos de Tocar Madera (referencia)
-- ============================================================
-- OJO: este archivo lo reconstruí a partir del código y del README, porque
-- el esquema original no estaba en el repositorio. Los nombres de tablas y
-- columnas son los que usa la app; los TIPOS de dato son mi mejor estimación.
--
-- Para comparar con tu base real, en el SQL Editor de Neon corre:
--   SELECT table_name, column_name, data_type, is_nullable
--   FROM information_schema.columns
--   WHERE table_schema = 'public'
--   ORDER BY table_name, ordinal_position;
-- y corrige aquí lo que no calce. La idea es que este archivo sirva para
-- recrear la base desde cero si algún día la necesitas (otro entorno, tests...).
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL PRIMARY KEY,
  username            TEXT NOT NULL UNIQUE,
  email               TEXT NOT NULL UNIQUE,
  password_hash       TEXT NOT NULL,
  role                TEXT NOT NULL DEFAULT 'user',   -- 'user' | 'admin'
  reset_token         TEXT,                           -- hash SHA-256 del token
  reset_token_expires TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS talleres (
  id            SERIAL PRIMARY KEY,
  nombre        TEXT NOT NULL,
  oficio        TEXT,
  bio           TEXT,
  foto_url      TEXT,
  instagram_url TEXT,
  ciudad        TEXT,
  region        TEXT,
  lat           NUMERIC,
  lng           NUMERIC,
  direccion     TEXT,
  telefono      TEXT,
  whatsapp_url  TEXT,
  sitio_web     TEXT,
  tecnica       TEXT,
  tipo_trabajo  TEXT,
  updated_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC NOT NULL,
  image_url   TEXT,                  -- columna antigua; las fotos van en product_images
  ciudad      TEXT,
  region      TEXT,
  lat         NUMERIC,
  lng         NUMERIC,
  taller_id   INTEGER REFERENCES talleres(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_images (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  orden      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS entrevistas (
  id               SERIAL PRIMARY KEY,
  titulo           TEXT NOT NULL,
  taller           TEXT NOT NULL,     -- nombre del taller como texto libre
  oficio           TEXT NOT NULL,
  descripcion      TEXT,
  tecnica          TEXT,
  instagram_url    TEXT,
  imagen_principal TEXT,
  fecha            DATE NOT NULL,
  ciudad           TEXT,
  region           TEXT,
  lat              NUMERIC,
  lng              NUMERIC,
  youtube_id       TEXT NOT NULL,
  taller_id        INTEGER REFERENCES talleres(id) ON DELETE SET NULL,
  updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));
