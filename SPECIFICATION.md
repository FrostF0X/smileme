# Aplikacja Rysunkowa PRO - Technical Specification

## 1. Overview
Aplikacja Rysunkowa PRO is an advanced, single-page drawing application built to run entirely in the browser. It allows users to create vector-based graphics with freehand drawing, geometric shapes, reference images, and generated backgrounds.

## 2. Architecture & Technologies
The application uses a modern frontend tech stack:
- **Core:** React and React DOM (v18)
- **Styling:** TailwindCSS for responsive UI styling
- **Build Tool:** Vite for fast bundling and development
- **Language:** JavaScript (ESModules)
- **Graphics:** SVG-based canvas. Pointer coordinates are mapped to SVG user space using `getScreenCTM().inverse()` and `createSVGPoint()` to accurately support canvas transformations like pan, zoom, and rotate.

The project follows a modular structure combining functional React components and strict OOP models.
- **Components:** Functional UI components located in `src/components/`.
- **Models:** Object-oriented data models located in `src/models/`.
- **Hooks:** Custom React hooks like `useDrawing` for canvas interaction located in `src/hooks/`.
- **Utils:** Helper functions for SVG processing, exporting, tracing, etc., located in `src/utils/`.

## 3. Core Features
- **Drawing:** Freehand drawing on an SVG canvas, creating path or ellipse elements.
- **Eraser:** An eraser tool to easily remove shapes by clicking/swiping. Swiping to erase multiple shapes is handled by a single undo step.
- **Selection & Fill:** Select a drawn object to modify its stroke color or apply a fill pattern (Dots, Grid, Stripes, or a custom SVG pattern uploaded by the user).
- **Undo/Redo:** A robust history management system.
- **Reference Image (Trace):** Users can upload a reference image, adjust its opacity, scale, and position to trace over it.
- **Export:** Export the drawing as a clean SVG file (`exportCleanSVG`).

## 4. Advanced Features
- **Auto-Ellipse (Snapper):** Automatically detects if a drawn path resembles a circle/ellipse and snaps it to a perfect geometric shape.
- **Path Smoothing (Smoother):** Smooths freehand paths using path simplification and Bezier curves.
- **Potrace Integration:** Uses a JavaScript port of Potrace to trace raster images and convert them into SVG vectors with multiple layers based on colors.
- **Generative AI Backgrounds:** Uses Google Imagen 3 (via direct REST API) to generate background images directly in the browser based on user prompts.

## 5. Data Models
The application employs OOP principles for data handling, keeping component state concise:
- `Shape`: Abstract base class representing a generic graphical shape.
- `Path`: Extends `Shape`. Represents a freehand or smoothed SVG path. Contains points or an SVG `d` string.
- `Ellipse`: Extends `Shape`. Represents a geometric ellipse.
- `DrawingHistory`: Manages state and the undo/redo stack. Includes a `commit(replace=false)` method for grouping continuous actions (like erasing multiple items in one swipe) into a single history step.

## 6. State Management & Persistence
The central drawing state is managed by `DrawingHistory` inside React's `useState`. State is automatically persisted across sessions using the browser's `localStorage` under the key `drawing_history_pro_v3`.

## 7. External APIs
- **Authentication:** Uses client-side Google OAuth 2.0 Implicit Flow via `@react-oauth/google` to securely authenticate the user.
- **Generative AI:** Integrates with Google Gen AI APIs (like `generativelanguage.googleapis.com`) using direct REST `fetch` calls. This avoids SDK constraints in browser environments while leveraging the user's Google Quota.

## 8. Error Handling
Global runtime errors in React components are caught using a React ErrorBoundary (`src/components/ErrorBoundary.jsx`). Asynchronous errors are managed by storing them in component state and throwing them during the render cycle to trigger the boundary.

## 9. Limitations & Requirements
- **Browser Only:** Designed for modern browsers.
- **Component File Limits:** Enforces a maximum limit of 30-40 lines per file for React components and OOP classes where possible, favoring modularity.