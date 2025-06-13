# 🥗 Vegzi - Algoritmos 2025

**Vegzi** es una red social enfocada en la alimentación saludable. Aquí puedes:

- Compartir tus recetas favoritas con la comunidad.
- Darle like a las recetas de otros usuarios.
- Explorar y descubrir recetas saludables que se ajusten a tus necesidades.

Nuestro objetivo es crear un espacio donde la comida saludable sea accesible, colaborativa e inspiradora.

---

## 🧠 Estructura del Proyecto (Scaffolding)

```bash
Vegzi-Algoritmos-2025/
├── .husky/                      # Hooks para automatización (pre-commit, etc.)
├── dist/                        # Archivos de distribución
├── node_modules/                # Dependencias del proyecto
├── public/                      # Archivos públicos como imágenes
├── src/
│   ├── components/              # Componentes reutilizables de la UI
│   │   ├── app-bar-container.ts
│   │   ├── app-bar-pc.ts
│   │   ├── food-card.ts
│   │   ├── food-cart.ts
│   │   └── food-popup.ts
│   ├── layouts/                 # Layouts principales de la app
│   │   └── app-container.ts
│   ├── services/                # Servicios (como conexión a datos)
│   │   └── FoodService.ts
│   ├── types/                   # Tipos TypeScript y definiciones
│   │   ├── food.types.ts
│   │   ├── imagesloaded.d.ts
│   │   └── masonry-layout.d.ts
│   ├── utils/                   # Utilidades del proyecto
│   │   ├── index.html
│   │   └── index.ts
├── .gitignore
├── eslint.config.js
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json

✍️ Convención de Commits
Para mantener un historial limpio y coherente, seguimos la siguiente convención de nombres de commits:

Tipo	Descripción
Fix	Corrección de errores
FEAT	Nuevas características o funcionalidades
STYLE	Cambios de formato que no afectan la lógica del código
REFACTOR	Cambios en la estructura del código sin corregir errores
TEST	Modificaciones o agregados en pruebas
CHORE	Tareas de mantenimiento o configuración del proyecto
breaking	Cambios que rompen compatibilidad con versiones anteriores
DOCS	Cambios en la documentación
CREATE COMPONENT	Creación de un nuevo componente

🚀 Tecnologías Usadas
TypeScript

HTML / CSS

Web Components

Husky

Eslint

Firebase (por definir si aplica)

Deploy 

https://grand-cuchufli-ddb870.netlify.app/
