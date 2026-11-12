# ⚛️ Guía Rápida de React

### Para el proyecto TocarMadera v2 🪵

---

## 1. ¿Qué es un componente?

Un componente es una **función JavaScript que retorna JSX** (HTML dentro de JS).

```javascript
// Esto es un componente
function Saludo() {
  return <h1>Hola TocarMadera!</h1>;
}
```

### Reglas de los componentes

- El nombre **siempre con mayúscula** → `Navbar`, `Footer`, `ProductCard`
- Siempre retorna **un solo elemento padre**

```javascript
// ❌ MAL — dos elementos al mismo nivel
function Malo() {
  return (
    <h1>Título</h1>
    <p>Párrafo</p>
  )
}

// ✅ BIEN — un solo elemento padre
function Bueno() {
  return (
    <div>
      <h1>Título</h1>
      <p>Párrafo</p>
    </div>
  )
}

// ✅ TAMBIÉN BIEN — Fragment vacío como padre (no genera HTML extra)
function BuenoTambien() {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  )
}
```

---

## 2. Export / Import

### Export default

```javascript
// Solo puede haber UN export default por archivo
// Es el componente principal del archivo
export default function Navbar() {
  return <nav>...</nav>;
}
```

### Export nombrado

```javascript
// Puede haber VARIOS exports nombrados por archivo
export function Boton() {
  return <button>Click</button>;
}

export function Input() {
  return <input />;
}
```

### Import

```javascript
// Import default — sin llaves
import Navbar from "./components/NavBar";

// Import nombrado — con llaves
import { Boton, Input } from "./components/Formulario";

// Import de Next.js
import Link from "next/link";
import Image from "next/image";
```

---

## 3. JSX — HTML dentro de JavaScript

JSX parece HTML pero tiene diferencias importantes:

| HTML                | JSX                        |
| ------------------- | -------------------------- |
| `class="..."`       | `className="..."`          |
| `for="..."`         | `htmlFor="..."`            |
| `<br>`              | `<br />`                   |
| `<img>`             | `<img />`                  |
| `onclick="..."`     | `onClick={...}`            |
| `style="color:red"` | `style={{ color: "red" }}` |

### Variables dentro de JSX

Usa `{}` para insertar JavaScript dentro del HTML:

```javascript
function Artesano() {
  const nombre = "María González";
  const ciudad = "Valdivia";

  return (
    <div>
      <h2>{nombre}</h2>
      <p>Ubicación: {ciudad}</p>
      <p>Año: {2024 + 1}</p>
    </div>
  );
}
```

---

## 4. Props — pasar datos entre componentes

Las props son como parámetros de una función — le pasan información a un componente.

```javascript
// Componente que RECIBE props
function TarjetaArtesano({ nombre, ciudad, oficio }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>{ciudad}</p>
      <p>{oficio}</p>
    </div>
  );
}

// Componente que ENVÍA props
export default function ListaArtesanos() {
  return (
    <div>
      <TarjetaArtesano
        nombre="María González"
        ciudad="Valdivia"
        oficio="Carpintería fina"
      />
      <TarjetaArtesano
        nombre="Carlos Pinto"
        ciudad="Temuco"
        oficio="Tallado en madera"
      />
    </div>
  );
}
```

### Props especiales: children

```javascript
// children es el contenido que va ENTRE las etiquetas del componente
function Tarjeta({ children }) {
  return (
    <div style={{ border: "1px solid brown", padding: "1rem" }}>{children}</div>
  );
}

// Se usa así:
function Pagina() {
  return (
    <Tarjeta>
      <h2>María González</h2>
      <p>Valdivia</p>
    </Tarjeta>
  );
}
```

---

## 5. useState — estado del componente

El estado es información que puede **cambiar** en el tiempo y que cuando cambia, **actualiza la pantalla automáticamente**.

```javascript
"use client"; // ← necesario en Next.js para usar useState

import { useState } from "react";

function Contador() {
  // [valorActual, funcionParaCambiar] = useState(valorInicial)
  const [cuenta, setCuenta] = useState(0);

  return (
    <div>
      <p>Clicks: {cuenta}</p>
      <button onClick={() => setCuenta(cuenta + 1)}>Sumar</button>
    </div>
  );
}
```

### Ejemplo real — mostrar/ocultar menú

```javascript
"use client";

import { useState } from "react";

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav>
      <button onClick={() => setMenuAbierto(!menuAbierto)}>Menú</button>

      {menuAbierto && (
        <div>
          <a href="/artesanos">Artesanos</a>
          <a href="/obras">Obras</a>
        </div>
      )}
    </nav>
  );
}
```

---

## 6. useEffect — ejecutar código cuando algo cambia

useEffect reemplaza al `document.addEventListener('DOMContentLoaded', ...)` de vanilla JS.

```javascript
"use client";

import { useState, useEffect } from "react";

function ListaProductos() {
  const [productos, setProductos] = useState([]);

  // Se ejecuta UNA vez cuando el componente carga
  useEffect(() => {
    fetch("https://tocar-madera-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProductos(data.products));
  }, []); // ← el [] vacío significa "solo al cargar"

  return (
    <div>
      {productos.map((producto) => (
        <div key={producto.id}>
          <h3>{producto.name}</h3>
          <p>${producto.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 7. Renderizado condicional

```javascript
function BotonAuth({ estaLogueado }) {
  // Opción 1 — operador ternario
  return (
    <div>
      {estaLogueado ? (
        <button>Cerrar sesión</button>
      ) : (
        <button>Ingresar</button>
      )}
    </div>
  );
}

// Opción 2 — && (solo muestra si es true)
function Carrito({ cantidadItems }) {
  return (
    <div>{cantidadItems > 0 && <span>🛒 {cantidadItems} items</span>}</div>
  );
}
```

---

## 8. Renderizar listas con .map()

```javascript
function ListaArtesanos({ artesanos }) {
  return (
    <div>
      {artesanos.map((artesano) => (
        // key es obligatorio — ayuda a React a identificar cada elemento
        <div key={artesano.id}>
          <h3>{artesano.nombre}</h3>
          <p>{artesano.ciudad}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 9. "use client" vs Server Components

En Next.js hay dos tipos de componentes:

|                 | Server Component | Client Component |
| --------------- | ---------------- | ---------------- |
| **Default**     | ✅ Sí            | ❌ No            |
| **useState**    | ❌ No            | ✅ Sí            |
| **useEffect**   | ❌ No            | ✅ Sí            |
| **onClick**     | ❌ No            | ✅ Sí            |
| **fetch datos** | ✅ Sí            | ✅ Sí            |
| **SEO**         | ✅ Mejor         | ⚠️ Regular       |

```javascript
// Server Component — sin declaración, es el default
// No puede tener useState, useEffect ni eventos
export default function PaginaArtesanos() {
  return <h1>Artesanos</h1>
}

// Client Component — necesita "use client" arriba
// Puede tener useState, useEffect y eventos
"use client"

import { useState } from "react"

export default function Buscador() {
  const [busqueda, setBusqueda] = useState("")
  return <input onChange={e => setBusqueda(e.target.value)} />
}
```

**Regla simple:** Si necesitas interactividad → `"use client"`. Si solo muestra datos → déjalo como está.

---

## 10. Link — navegación en Next.js

Nunca uses `<a>` para links internos en Next.js. Usa `<Link>`:

```javascript
import Link from "next/link";

function Navbar() {
  return (
    <nav>
      {/* ✅ Link interno — no recarga la página */}
      <Link href="/artesanos">Artesanos</Link>
      <Link href="/obras">Obras</Link>

      {/* ✅ Link externo — sí usa <a> */}
      <a href="https://instagram.com/tocarmadera_" target="_blank">
        Instagram
      </a>
    </nav>
  );
}
```

---

## 11. Estructura de archivos en Next.js

```
app/
├── layout.js              ← estructura base (Navbar + Footer)
├── page.js                ← ruta /
├── globals.css            ← estilos globales
├── components/            ← componentes reutilizables
│   ├── NavBar.js
│   ├── Footer.js
│   └── TarjetaArtesano.js
├── artesanos/
│   ├── page.js            ← ruta /artesanos
│   └── [id]/
│       └── page.js        ← ruta /artesanos/123 (dinámica)
├── obras/
│   └── page.js            ← ruta /obras
└── login/
    └── page.js            ← ruta /login
```

---

## 12. Convenciones de nomenclatura

| Qué                | Cómo          | Ejemplo                              |
| ------------------ | ------------- | ------------------------------------ |
| Componentes        | PascalCase    | `NavBar.js`, `TarjetaArtesano.js`    |
| Carpetas de rutas  | minúscula     | `artesanos/`, `obras/`               |
| Archivos de página | siempre igual | `page.js`                            |
| Variables          | camelCase     | `nombreArtesano`, `precioObra`       |
| Funciones          | camelCase     | `cargarProductos()`, `handleLogin()` |
| Constantes         | MAYÚSCULA     | `API_URL`                            |

---

## Código base — componente típico con fetch

```javascript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ListaArtesanos() {
  const [artesanos, setArtesanos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarArtesanos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/artesanos`,
        );
        const data = await res.json();
        setArtesanos(data.artesanos);
      } catch (err) {
        setError("Error cargando artesanos");
      } finally {
        setCargando(false);
      }
    };

    cargarArtesanos();
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h1>Artesanos de Chile</h1>
      <div>
        {artesanos.map((artesano) => (
          <div key={artesano.id}>
            <h2>{artesano.nombre}</h2>
            <p>{artesano.ciudad}</p>
            <Link href={`/artesanos/${artesano.id}`}>Ver historia</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
```

---

_Guía creada para TocarMadera v2 🪵_
_Mercado colaborativo de artesanos chilenos_
