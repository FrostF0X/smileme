# Aplikacja Rysunkowa PRO

Aplikacja Rysunkowa PRO to zaawansowana, jednoplikowa (Single-Page Application) aplikacja do rysowania działająca w całości w przeglądarce internetowej. Stworzona przy użyciu technologii **React** oraz stylowana za pomocą **TailwindCSS**.

## 🎨 Główne funkcje i możliwości

- **Auto-Elipsy (Snapper)**: Automatycznie wykrywa próby narysowania okręgu lub elipsy i konwertuje odręczny rysunek w idealne geometrycznie kształty.
- **Płynne Krzywe (Smoother)**: Wykorzystuje algorytmy upraszczania ścieżek oraz krzywe Béziera, aby wygładzać drżące, odręczne linie i zamieniać je w płynne ścieżki (z możliwością domknięcia kształtu).
- **Wybieranie i Wypełnianie (Select)**: Pozwala na wybranie konkretnego narysowanego obiektu i zmianę jego koloru obramowania, a także dodanie wypełnienia z zastosowaniem zaawansowanych wzorów (Kropki, Siatka, Paski, a także Własne pliki SVG - `customPatternSvg`).
- **Gumka (Eraser)**: Pozwala na łatwe kasowanie wskazanych kształtów za pomocą jednego kliknięcia.
- **Obraz Referencyjny (Kalka)**: Funkcjonalność podkładania dowolnego obrazu graficznego jako tła, z możliwością regulacji jego przezroczystości (krycia), skalowania, i pozycjonowania - służącego jako punkt odniesienia podczas rysowania.
- **Eksport do SVG (`exportCleanSVG`)**: Możliwość zapisania stworzonego dzieła na dysku w postaci wysokiej jakości, wektorowego pliku `.svg`, zachowującego przezroczystość, kształty i nakładane wzory.
- **Historia Operacji (Undo/Redo)**: Funkcja cofania (Undo) i ponawiania (Redo) pociągnięć pędzla lub modyfikacji kształtów. Aplikacja zapisuje również stan do pamięci przeglądarki (`localStorage`).

## 🛠️ Technologie

Aplikacja jest zbudowana przy użyciu nowoczesnych narzędzi frontendowych:
- **React** i **React DOM** (v18)
- **Vite** (jako ultraszybki bundler i serwer deweloperski)
- **TailwindCSS** (do nowoczesnego, responsywnego stylowania)

## 🚀 Jak uruchomić

Aby uruchomić aplikację lokalnie, wykonaj następujące kroki:

1. Zainstaluj zależności: `npm install` (lub `npm ci`)
2. Uruchom serwer deweloperski: `npm run dev`
3. Aby zbudować aplikację produkcyjną, uruchom: `npm run build`
4. Zbudowane pliki znajdą się w folderze `dist/`.

### Deploy na GitHub Pages

Projekt jest skonfigurowany do automatycznego wdrażania na GitHub Pages. Plik konfiguracyjny `.github/workflows/deploy.yml` automatycznie instaluje zależności (`npm ci`), buduje projekt (`npm run build`) i publikuje folder `dist/` po każdym `push` do gałęzi `main`.

---
_Aplikacja przygotowana jako łatwe, profesjonalne narzędzie wektorowe, dające swobodę ekspresji twórcom, niezależnie od urządzenia, z którego korzystają._