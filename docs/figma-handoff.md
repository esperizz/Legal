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
- **Components (página `1:72`):** Button (`5:17`, Style Primary/Secondary/Ghost × Size MD/LG,
  propiedad Label) y TextField (`5:45`, State Default/Filled/Focus/Error, propiedades Label,
  Help, Show help, Value, Error message). Próximo componente se ubica en y ≈ 1024.

## Pendiente

1. Componentes: OptionCard (Type Radio/Checkbox × Selected), Callout (Info/Success/Warning),
   Progress (pasos 1-6 + Revisión), Letter (vista previa de la carta, Incompleta/Completa),
   Header y barra inferior mobile.
2. Pantallas mobile (390 px) armadas con instancias: Landing, Paso tipo, Paso "¿Qué pasó?" con
   vista previa, Paso pedido con error, Revisión, Carta lista, ¿Y después?, Derivación.
3. Pantallas desktop: Landing, Cuestionario con vista previa lateral, Carta lista.
4. Revisión visual final de cada página.

Referencia visual: la app funcionando (`npm run dev`), que ya refleja las correcciones de la
evaluación heurística.
