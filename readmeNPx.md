# 🪵 Guía: Cómo crear un proyecto Next.js

## ¿Qué es `create-next-app`?

Es el comando oficial para crear un proyecto Next.js desde cero.
Lo que hace es crear todos los archivos base, instalar las dependencias
y dejarte listo para empezar a trabajar.

---

## El comando base

```bash
npx create-next-app@latest nombre-del-proyecto
```

- `npx` → ejecuta un paquete de npm sin instalarlo globalmente
- `create-next-app@latest` → usa la versión más reciente
- `nombre-del-proyecto` → el nombre de la carpeta que va a crear

Si ya estás dentro de la carpeta donde quieres instalar, usa un punto:

```bash
npx create-next-app@latest .
```

---

## Las opciones (flags)

Los flags son instrucciones adicionales que le das al comando.
Cada uno empieza con `--` y define cómo se configura el proyecto.

### Lenguaje

| Flag   | Qué hace                                                   |
| ------ | ---------------------------------------------------------- |
| `--js` | Usa **JavaScript** puro ✅ recomendado para principiantes  |
| `--ts` | Usa **TypeScript** (más estricto, requiere declarar tipos) |

> **¿Cuál elegir?** Si estás aprendiendo, JavaScript puro (`--js`).
> TypeScript es poderoso pero agrega complejidad innecesaria al inicio.

---

### Estilos CSS

| Flag            | Qué hace                                                          |
| --------------- | ----------------------------------------------------------------- |
| `--tailwind`    | Instala **Tailwind CSS** — clases de utilidad directas en el HTML |
| `--no-tailwind` | Sin Tailwind, escribes CSS normal                                 |

> **¿Cuál elegir?** `--tailwind` es la opción más usada hoy en día.
> Te permite estilizar directamente en el JSX sin archivos CSS separados.

Ejemplo con Tailwind:

```jsx
// En vez de ir a un archivo CSS y escribir una clase
// escribes el estilo directamente en el componente
<button className="bg-green-500 text-white px-4 py-2 rounded">
  Agregar al carrito
</button>
```

---

### Estructura de carpetas

| Flag           | Qué hace                                            |
| -------------- | --------------------------------------------------- |
| `--src-dir`    | Crea una carpeta `src/` donde vive todo el código   |
| `--no-src-dir` | El código vive directamente en la raíz del proyecto |

> **¿Cuál elegir?** `--no-src-dir` es más simple para empezar.
> La carpeta `src/` es útil en proyectos muy grandes.

```
# Con --src-dir          # Con --no-src-dir
src/                     app/
  app/                     layout.jsx
    layout.jsx             page.jsx
    page.jsx
```

---

### Router (sistema de rutas)

| Flag       | Qué hace                                              |
| ---------- | ----------------------------------------------------- |
| `--app`    | Usa el **App Router** — el sistema moderno de Next.js |
| `--no-app` | Usa el **Pages Router** — el sistema antiguo          |

> **¿Cuál elegir?** Siempre `--app`. El Pages Router es legado.

Con App Router, las rutas se crean por carpetas:

```
app/
├── page.jsx           → ruta /
├── artesanos/
│   └── page.jsx       → ruta /artesanos
└── obras/
    └── page.jsx       → ruta /obras
```

---

### Bundler (empaquetador)

| Flag             | Qué hace                                                           |
| ---------------- | ------------------------------------------------------------------ |
| `--turbopack`    | Usa **Turbopack** — el bundler nuevo, más rápido pero experimental |
| `--no-turbopack` | Usa **Webpack** — el bundler clásico, más estable                  |

> **¿Cuál elegir?** `--no-turbopack` para mayor estabilidad.
> Turbopack todavía está en desarrollo activo.

---

### Otras opciones

| Flag                   | Qué hace                                                        |
| ---------------------- | --------------------------------------------------------------- |
| `--eslint`             | Instala ESLint — detecta errores en tu código mientras escribes |
| `--no-eslint`          | Sin ESLint                                                      |
| `--import-alias "@/*"` | Configura un alias para importar archivos más fácil             |
| `--no-import-alias`    | Sin alias de importación                                        |

---

## El comando que usamos en TocarMadera v2

```bash
npx create-next-app@latest . --js --tailwind --eslint --app --no-src-dir --no-turbopack
```

Desglosado:

| Parte            | Significado                      |
| ---------------- | -------------------------------- |
| `.`              | Instalar en la carpeta actual    |
| `--js`           | JavaScript puro (no TypeScript)  |
| `--tailwind`     | Con Tailwind CSS                 |
| `--eslint`       | Con ESLint para detectar errores |
| `--app`          | Con App Router (sistema moderno) |
| `--no-src-dir`   | Sin carpeta src/, más simple     |
| `--no-turbopack` | Con Webpack, más estable         |

---

## Estructura resultante

Después de instalar con ese comando, la estructura queda así:

```
05tocarmadera-v2/
├── app/
│   ├── globals.css      ← estilos globales
│   ├── layout.jsx       ← estructura base de todas las páginas
│   └── page.jsx         ← página de inicio (ruta /)
├── public/              ← imágenes y archivos estáticos
├── .env.local           ← variables de entorno (tú lo creas)
├── .gitignore           ← archivos ignorados por git
├── eslint.config.mjs    ← configuración de ESLint
├── jsconfig.json        ← configuración de JavaScript
├── next.config.mjs      ← configuración de Next.js
├── package.json         ← dependencias del proyecto
├── postcss.config.mjs   ← necesario para Tailwind
└── tailwind.config.mjs  ← configuración de Tailwind
```

### ¿Qué puedes borrar?

- Todo el contenido de `public/` (son imágenes de ejemplo de Next.js)
- `README.md` (puedes escribir el tuyo)

### ¿Qué NO debes tocar?

- `node_modules/` (dependencias instaladas)
- `.next/` (archivos compilados, se genera automáticamente)
- `package-lock.json` (registro exacto de versiones)

---

## Comandos del día a día

```bash
# Arrancar el servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Correr la versión de producción
npm start

# Revisar errores de ESLint
npm run lint
```

---

## Recursos para seguir aprendiendo

- Documentación oficial Next.js: https://nextjs.org/docs
- Tutorial interactivo oficial: https://nextjs.org/learn
- Documentación Tailwind CSS: https://tailwindcss.com/docs
- React desde cero: https://react.dev/learn

---

_Guía creada para el proyecto TocarMadera v2 🪵_
_Mercado colaborativo de artesanos chilenos_
