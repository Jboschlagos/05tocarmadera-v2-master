-- ============================================================
-- Migración 001 — mejoras de la revisión (noviembre 2026)
-- ============================================================
-- Cómo correrla: abre tu proyecto en https://console.neon.tech,
-- entra a "SQL Editor", pega TODO este archivo y presiona "Run".
-- Es segura de correr más de una vez (cada paso revisa si ya existe).
-- ============================================================

-- 1) Carrito: un mismo usuario no puede tener el mismo producto en dos filas.
--    Primero juntamos posibles duplicados que ya existan (sumando cantidades),
--    después creamos la restricción UNIQUE que necesita el "ON CONFLICT"
--    de app/api/cart/route.js.
WITH duplicados AS (
  SELECT user_id, product_id, MIN(id) AS id_que_queda, SUM(quantity) AS total
  FROM cart_items
  GROUP BY user_id, product_id
  HAVING COUNT(*) > 1
)
UPDATE cart_items ci
SET quantity = LEAST(d.total, 99)
FROM duplicados d
WHERE ci.id = d.id_que_queda;

DELETE FROM cart_items ci
USING cart_items otro
WHERE ci.user_id = otro.user_id
  AND ci.product_id = otro.product_id
  AND ci.id > otro.id;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cart_items_user_product_unique'
  ) THEN
    ALTER TABLE cart_items
      ADD CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id);
  END IF;
END $$;

-- 2) Entrevistas vinculadas a un taller. Tus páginas ya usan esta columna;
--    si ya existe, esta línea no hace nada.
ALTER TABLE entrevistas
  ADD COLUMN IF NOT EXISTS taller_id INTEGER REFERENCES talleres(id) ON DELETE SET NULL;

-- 3) Búsqueda rápida de usuarios por email sin importar mayúsculas
--    (el login ahora usa LOWER(email)).
CREATE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));

-- 4) Los tokens de recuperación ahora se guardan "hasheados". Borramos los
--    que pudieran quedar pendientes del sistema anterior (eran de 30 min).
UPDATE users SET reset_token = NULL, reset_token_expires = NULL
WHERE reset_token IS NOT NULL;
