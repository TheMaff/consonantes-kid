# Consonantes Kid

> **MathiLearn**: App didáctica de lectoescritura por consonantes para preescolar (5 años), usando React, Chakra UI y Supabase.

---

## 📖 Descripción

Consonantes Kid es una aplicación web móvil-first para ayudar a niños de 5 años a aprender lectoescritura por consonantes.  
Cada “nivel” es una consonante (M, P, S, …). El niño:

1. Inicia sesión con magic link (correo electrónico) vía Supabase.  
2. Completa palabras arrastrando o haciendo clic en fichas.  
3. Obtiene feedback inmediato:  
   - *Slots* iluminan en rojo si hay errores (errorSfx).  
   - *Slots* brillan (glow) y suena un ding si la palabra es correcta.  
4. Avanza por frases, obtiene fanfarrias al terminar cada nivel y gana medallas.  
5. Lleva un registro de progreso y medallas (Supabase `user_progress` y `user_badges`).  
6. Puede configurar su perfil (avatar + nombre) tras el magic link.  
7. Navega entre niveles mediante un carrusel infinito estilo “máquina tragamonedas”.

---

## 🚀 Tecnologías

- **Framework**: React 18 + Vite  
- **UI**: Chakra UI (con tema extendido, `layerStyle="glow"`)  
- **Drag & Drop**: `@dnd-kit/core` + `@dnd-kit/utilities`  
- **Carousel**: `react-slick` + `slick-carousel`  
- **Auth & BBDD**: Supabase v2 (`@supabase/supabase-js`)  
- **Text-to-Speech**: Web Speech API (`speechSynthesis`)  
- **Routing**: react-router v6  
- **Estado global**: Context API (Auth, Data, Progress, Badges)  

---

## 📦 Instalación y puesta en marcha

1. **Clona el repo**  
   ```bash
   git clone https://github.com/TheMaff/consonantes-kid.git
   cd consonantes-kid
   ```

2. **Instala dependencias**  
   ```bash
   pnpm install
   ```

3. **Copia y configura variables de entorno**  
   Crea un `.env.local` en la raíz con:  
   ```dotenv
   VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   VITE_REDIRECT=http://localhost:5173/auth/callback
   VITE_JSON_URL=<url_json_palabras>
   ```
   - `VITE_REDIRECT` debe coincidir con las URLs de autorización en Supabase.  
   - `VITE_JSON_URL` apunta al JSON público con datos de consonantes y palabras.

4. **Arranca en modo dev**  
   ```bash
   pnpm run dev
   ```
   Abre `http://localhost:5173`.

---

## 🌳 Estructura de ramas y flujo Git

Usamos Git Flow simplificado:

- **`main`**: Código listo para producción (deploy en Vercel).  
- **`develop`** *(opcional)*: Integra features antes de pasar a `main`.  
- **`feature/<nombre>`**: Ramas de funcionalidad.  
- **`fix/<bug>`**: Ramas de corrección.  

### Flujo recomendado

1. Desde `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b feature/<tu-descripción>
   ```
2. Desarrolla y haz commits atómicos, usando convenciones [Conventional Commits]:
   - `feat: nueva funcionalidad DragLetters glow`  
   - `fix: corregir desbloqueo de niveles`  
   - `chore: actualizar dependencias`  
3. Push y PR contra `main` (o `develop`):
   ```bash
   git push -u origin feature/<tu-descripción>
   ```
4. Revisión → merge → CI/CD despliega en Vercel.

---

## ⚙️ Scripts disponibles

| Comando             | Descripción                          |
| ------------------- | ------------------------------------ |
| `pnpm run dev`      | Levanta server de desarrollo (Vite)  |
| `pnpm run build`    | Genera build de producción           |
| `pnpm run preview`  | Sirve build listo para probar        |
| `pnpm run lint`     | Corre ESLint                         |

---

## 📡 Despliegue

Se usa **Vercel**:

1. Conecta el repo en Vercel.  
2. Asegúrate de definir en **Vercel → Settings → Environment Variables** tus `VITE_*`.  
3. Branch production: `main`.  
4. Cada merge a `main` lanza un build automático.

---

## 🗂️ Esquema de Base de Datos (Supabase)

```sql
-- Tabla de progreso
CREATE TABLE user_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id),
  consonant text NOT NULL,
  word_index integer NOT NULL DEFAULT 0,
  done boolean NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, consonant)
);

-- Tabla de medallas
CREATE TABLE user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  level_id text NOT NULL,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
```

---

## 🤝 Cómo contribuir

1. Revisa los **issues** abiertos.  
2. Crea tu rama `feature/…` o `fix/…`.  
3. Sigue el **flujo Git** arriba.  
4. Abre un **Pull Request** describiendo:
   - Qué hace tu cambio (`feat`, `fix`, `chore`, …).  
   - Cómo probarlo.  
5. Etiqueta a un revisor y espera aprobación.

---

## 📝 Licencia

MIT License

  
