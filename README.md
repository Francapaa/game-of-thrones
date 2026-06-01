# Game of Thrones — El Trono de Hierro

Página web para la cursada de **Programación 4** de la carrera de Sistemas.

## Descripción

Sitio web tributo interactivo a la serie *Game of Thrones*, desarrollado con tecnologías web vanilla (HTML, CSS y JavaScript) más **Three.js** para gráficos 3D en tiempo real. El sitio presenta información sobre los reinos del Norte y del Sur, personajes principales, frases memorables y efectos visuales inmersivos.

## Tecnologías utilizadas

- **HTML5** — estructura de las páginas
- **CSS3** — diseño responsivo, animaciones y sistema de colores temáticos
- **JavaScript (Vanilla)** — interactividad, animaciones al scroll, menú mobile
- **Three.js** — fondo 3D con shaders GLSL, partículas de fuego/hielo/ámbar, animación de dragón
- **Google Fonts** — tipografías Cinzel y Cormorant Garamond

## Páginas

| Página | Ruta | Descripción |
|--------|------|-------------|
| Inicio | `index.html` | Portada con héroe, estadísticas de la serie y frases memorables |
| El Norte | `norte.html` | Reinos del Norte: Stark, Tully, Arryn, Greyjoy |
| El Sur | `sur.html` | Reinos del Sur: Lannister, Baratheon, Tyrell, Martell |
| Personajes | `personajes.html` | Perfiles de personajes principales y formulario de contacto |

## Funcionalidades destacadas

- Fondo 3D animado con temática de color por página (fuego, hielo, ámbar, violeta)
- Partículas que rodean las casas al hacer hover
- Animación periódica de un dragón volador
- Contadores animados que se activan al hacer scroll
- Diseño responsivo adaptable a dispositivos móviles
- Menú hamburguesa en mobile con animación

## Cómo ejecutar

El proyecto es completamente estático. Solo necesitas un servidor HTTP simple:

```bash
# Con Python
python -m http.server 8080

# Con Node.js (si tenés npx)
npx serve .

# O直接用 VS Code con Live Server
```

Luego abrí `http://localhost:8080` en tu navegador.

## Estructura del proyecto

```
├── index.html              # Página principal
├── norte.html              # Reinos del Norte
├── sur.html                # Reinos del Sur
├── personajes.html         # Personajes y formulario
├── styles.css              # Estilos globales
├── script.js               # Interactividad del lado cliente
├── three-background.js     # Fondo 3D con Three.js
├── public/                 # Imágenes de personajes
│   ├── game-of-thrones.jpg
│   ├── jon-snow.webp
│   ├── Daenerys_Targaryen_Queen.webp
│   └── ...
└── .agents/                # Especificaciones de diseño para asistentes IA
```
