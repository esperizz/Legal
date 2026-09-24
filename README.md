# Reclamá

Generador de cartas documento en lenguaje claro. La persona responde 6 preguntas simples
(qué pasó, a quién le reclama, qué le pide…) y obtiene el texto listo para enviar por el
Correo Argentino, con vista previa en vivo. Después la guía sobre qué hacer si no le responden.

> Proyecto de portfolio (MVP). No brinda asesoramiento legal.

## Proceso de diseño

El discovery, el Lean Canvas, la proto-persona, el mapa de experiencia, las hipótesis,
la priorización y el flujo están en el tablero de FigJam:
https://www.figma.com/board/X86MSPhL705rdLucXSEM30

## Pantallas

| Ruta | Qué es |
|---|---|
| `/` | Landing |
| `/reclamo` | Cuestionario de 6 pasos con vista previa en vivo, y revisión final |
| `/reclamo/lista` | Carta lista: copiar, descargar, imprimir, cómo enviarla, oferta de revisión |
| `/reclamo/despues` | ¿Y después? Plazos, recordatorio y siguientes pasos |
| `/derivacion?motivo=…` | Derivación: telegrama laboral o contacto con abogado (prueba de interés) |
| `/design-system` | Tokens y componentes |
| `/metricas` | Embudo y pruebas de interés del MVP (datos del navegador) |

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # tests de la generación de la carta y validaciones
npm run lint
npm run build
```

## Estructura

- `src/lib/reclamo/` — lógica del producto: catálogo de reclamos, generación del texto,
  validaciones y formato (fechas, montos, días hábiles). Sin dependencias de UI.
- `src/components/ui/` — componentes del design system.
- `src/components/reclamo/` — pantallas del flujo.
- `src/app/globals.css` — tokens de diseño (colores, tipografía, radios, sombras).

Las respuestas se guardan solo en el navegador (`localStorage`), igual que los eventos de
medición. Las ofertas de revisión, derivación y recordatorio son pruebas de interés:
registran el clic y le explican al usuario que la función todavía no está disponible.
