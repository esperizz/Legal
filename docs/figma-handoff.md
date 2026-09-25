# Traspaso: trabajo en Figma

Estado del volcado a Figma del proyecto Reclamá, para retomar en una sesión nueva.

## Archivos

- **Tablero FigJam (proceso):** https://www.figma.com/board/X86MSPhL705rdLucXSEM30
  Secciones: 0 Replanteo · 1 Descubrir · 1b Research · 1c Proto-persona · 1d Experiencia actual ·
  1e Oportunidades · 1f Competencia · 2 Lean Canvas · 2b Priorización MVP · 2c Principios de contenido ·
  3 Flujo del MVP (v2) · 4 Evaluación heurística. **Completo.**
- **Design system y UI:** https://www.figma.com/design/m3YRxYaNzdOFghTJ38NlrY (plan Pro, equipo "Drafts",
  planKey `team::1389606702536324844`)

## Hecho en el archivo de diseño

- **Páginas:** Cover (`0:1`), Foundations (`1:70`), Components (`1:72`), Screens · Mobile (`1:74`),
  Screens · Desktop (`1:75`).
- **Variables (51):** colecciones Primitives (18, ocultas), Color (19 semánticas, modo Light),
  Layout (spacing/1..16 y radius/sm, control, card, full). Nombres iguales a los tokens de
  `src/app/globals.css` (por ejemplo `color/primary` → `var(--color-primary)`).
  IDs de color: primary `VariableID:1:22`, primary-hover `1:23`, primary-soft `1:24`, ink `1:25`,
  muted `1:26`, subtle `1:27`, canvas `1:28`, surface `1:29`, paper `1:30`, line `1:31`,
  line-strong `1:32`, success `1:33`, success-soft `1:34`, warning `1:35`, warning-soft `1:36`,
  danger `1:37`, danger-soft `1:38`, marker `1:39`, on-primary `1:40`.
  Layout: spacing/1 `1:42`, 2 `1:43`, 3 `1:44`, 4 `1:45`, 5 `1:46`, 6 `1:47`, 8 `1:48`,
  10 `1:49`, 12 `1:50`, 16 `1:51`; radius/sm `1:52`, control `1:53`, card `1:54`, full `1:55`.
- **Estilos de texto (12):** Display, Heading/H1-H3, Body/Large-Base-Small, Label/Base-Small,
  Overline (Inter) y Letter/Body, Letter/Small (Source Serif 4).
- **Estilos de efecto:** Shadow/Card, Shadow/Sheet.
- **Cover** y **Foundations** (muestras de color, tipografía, radios y sombras) terminadas.
- **Components (página `1:72`), completa:**
  - Button (`5:17`, Style Primary/Secondary/Ghost × Size MD/LG, propiedad Label).
  - TextField (`5:45`, State Default/Filled/Focus/Error, propiedades Label, Help, Show help,
    Value, Error message).
  - OptionCard (`8:25`, Type Radio/Checkbox × Selected No/Yes, propiedades Título, Descripción,
    Mostrar descripción).
  - Callout (`9:19`, Tono Info/Success/Warning, propiedades opcional Título y Texto).
  - Progress (`13:30`, variante Paso 1-6 y Revision; cada variante trae su propio texto y ancho
    de relleno — ver nota debajo).
  - Letter (`14:34`, Estado Incompleta/Completa; los marcadores `[dato]` del código se muestran
    como texto en color warning en vez del chip con fondo amarillo, por simplicidad).
  - Header (`16:29`, Layout Landing/Wizard/Simple; Wizard tiene la propiedad booleana "Mostrar
    texto guardado" para ocultar el aviso en mobile; usa instancias de Button/Ghost/MD).
  - BarraInferior (`18:12`, ConVerCarta Yes/No; usa instancias de Button/Secondary/LG y
    Button/Primary/LG).
- **Pantallas · Mobile (página `1:74`), completa — 8 pantallas de 390 px de ancho, en una fila
  sin superposición:** Landing, Paso 1 · Tipo, Paso 2 · Qué pasó (con vista previa inline),
  Paso 4 · Pedido (con error), Revisión, Carta lista, ¿Y después?, Derivación (motivo laboral).
  Todas armadas con instancias de los componentes de la página Components.
- **Pantallas · Desktop (página `1:75`), completa — 3 pantallas de 1440 px, en una fila:**
  Landing (hero a 2 columnas), Cuestionario con vista previa lateral (columna de 440 px,
  Header con el aviso "Se guarda en este dispositivo" visible), Carta lista.
- Revisión visual final hecha con capturas de cada página completa: sin overlaps, sin texto
  cortado, contenido y jerarquía visual consistentes con la app real.

## Nota técnica: bug de texto compartido en variantes

Al crear una propiedad `TEXT` con `addComponentProperty` por separado en cada variante de un
component set (mismo nombre de propiedad, ej. "Etiqueta" en Progress), Figma fusiona esas
propiedades en una sola definición compartida: todas las instancias terminan mostrando el
valor por defecto de la *primera* variante creada, sin importar cuál esté seleccionada. Se
corrigió sobreescribiendo el valor de esa propiedad por instancia (`setProperties`) según el
nombre real de la variante. Si se agregan más pasos/variantes al componente Progress en el
futuro, aplicar el mismo ajuste.

## Pendiente (opcional, no bloqueante)

- Revisar visualmente en Figma (no solo por captura) que los textos largos no corten en algún
  ancho intermedio no probado.
- Si se quiere mayor fidelidad, reemplazar el chip amarillo de los marcadores en Letter por una
  solución con fondo real (hoy es solo texto en color warning).
- No se creó un componente reusable de Textarea ni de campo de fecha: en las pantallas que los
  usan ("¿Qué pasó?") se armaron a partir de instancias de TextField con el input agrandado a
  mano. Si se quiere que sea un componente aparte, falta crearlo en la página Components.

Referencia visual: la app funcionando (`npm run dev`), que ya refleja las correcciones de la
evaluación heurística.
