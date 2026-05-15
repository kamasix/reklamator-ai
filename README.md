# Reklamator AI

> Darmowy generator reklamacji konsumenckich. Bez konta. Bez płatności. Działa lokalnie w przeglądarce – Twoje dane nie są wysyłane na serwer.

Reklamator AI to statyczna aplikacja webowa po polsku, która pomaga przygotować formalne pismo reklamacyjne lub odwoławcze: zwrot pieniędzy, reklamacja produktu, rękojmia/gwarancja, brak dostawy, nieautoryzowana opłata, zablokowane konto online, problem z operatorem lub serwisem.

**Aplikacja nie zastępuje porady prawnika.** Pomaga uporządkować informacje i przygotować czytelne pismo na podstawie danych wpisanych przez użytkownika.

## Co potrafi

- Kreator sprawy w 5 krokach (kategoria → dane podstawowe → szczegóły → dowody → podsumowanie)
- 9 kategorii spraw, każda z własnym szablonem pisma
- 5 tonów wypowiedzi: formalny, stanowczy, krótki, bardzo dokładny, spokojny
- Lokalna lista spraw z filtrami i wyszukiwaniem
- Edytowalne pismo, kopiowanie do schowka, eksport do PDF
- Edytor dowodów (opisy, nazwy plików, daty – bez przesyłania plików)
- Checklista per sprawa, z kategorią-świadomymi krokami domyślnymi
- Edytor notatek z historią zmian
- Eksport / import wszystkich spraw jako JSON
- PWA – możesz dodać aplikację do ekranu domowego i używać offline
- Motyw jasny / ciemny / systemowy

## Dlaczego działa bez backendu

- Wszystkie sprawy są przechowywane w `IndexedDB` w Twojej przeglądarce (przez `localforage`).
- Pisma generuje deterministyczny generator szablonowy w JavaScript – bez AI API.
- PDF tworzony jest po stronie klienta (`html2pdf.js`).
- Eksport JSON to plik pobierany przeglądarką; import wczytuje plik lokalnie.
- Brak wymagań co do serwera – wystarczy hosting plików statycznych (GitHub Pages, Cloudflare Pages, własny nginx).

## Tech stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn-style komponenty
- React Router (`HashRouter` – kompatybilny z GitHub Pages)
- React Hook Form + Zod
- localforage (IndexedDB)
- html2pdf.js (lazy-loaded)
- vite-plugin-pwa
- date-fns + lucide-react + sonner

## Uruchomienie lokalne

Wymagania: Node.js 20+ i npm.

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:5173`.

## Build produkcyjny

```bash
npm run build
npm run preview
```

`npm run build` uruchamia `tsc -b` (sprawdzenie typów) oraz `vite build` (bundling). Wynik trafia do katalogu `dist/`.

## Wdrożenie na GitHub Pages

W repozytorium znajduje się gotowy workflow `.github/workflows/deploy.yml`. Zalecane kroki:

1. Wypchnij projekt do repozytorium GitHub (np. `github.com/twoj-login/reklamator-ai`).
2. W ustawieniach repo otwórz **Settings → Pages** i wybierz **Source: GitHub Actions**.
3. Wypchnij commit do gałęzi `main`. Workflow zbuduje aplikację i opublikuje ją.

Workflow automatycznie ustawia `VITE_BASE_PATH`:

- dla repo typu `username.github.io` → `/`
- dla każdego innego repo → `/REPO_NAME/`

### Ręczna zmiana base path

Jeżeli używasz innego hostingu lub własnej domeny, możesz nadpisać `base` w jeden z dwóch sposobów:

- Ustawić zmienną środowiskową `VITE_BASE_PATH` przed `npm run build`:

  ```bash
  VITE_BASE_PATH="/inna-sciezka/" npm run build
  ```

- Lub bezpośrednio edytować `vite.config.ts` (zmienić wartość zwracaną przez `base`).

### Wdrożenie ręczne (bez GitHub Actions)

```bash
VITE_BASE_PATH="/REPO_NAME/" npm run build
# wgraj katalog dist/ na hosting
```

Plik `public/.nojekyll` jest automatycznie kopiowany do `dist/` – zapobiega temu, by GitHub Pages zignorował zasoby zaczynające się od `_`.

## Jak działają dane lokalne

- Wszystkie sprawy zapisywane są w `IndexedDB` (z fallbackiem do WebSQL / localStorage przez `localforage`).
- Aplikacja **nigdy** nie wysyła Twoich danych na serwer.
- W trybie prywatnym Safari magazyn może być ulotny – pasek statusu w aplikacji ostrzeże o tym.
- Jeżeli wyczyścisz dane przeglądarki dla domeny aplikacji – sprawy znikną. Regularnie rób backup JSON.

## Eksport / import JSON

W zakładce **Ustawienia** lub na **Liście spraw**:

- **Eksportuj dane (JSON)** – pobiera plik `reklamator-ai-backup-YYYY-MM-DD.json` z wszystkimi sprawami.
- **Importuj dane (JSON)** – wczytuje plik i pozwala wybrać:
  - **Scalić** z istniejącymi sprawami (te o tym samym `id` zostaną nadpisane),
  - **Zastąpić** całą zawartość (uwaga: usuwa pozostałe dane lokalne).

Schemat JSON:

```json
{
  "app": "reklamator-ai",
  "version": 1,
  "exportedAt": "2026-05-14T18:00:00.000Z",
  "cases": [ ... ]
}
```

Format jest walidowany przez Zod – pliki obcego pochodzenia zostaną odrzucone.

## Eksport PDF

Pismo eksportowane jest po stronie klienta przez `html2pdf.js` (canvas → PDF). Polskie znaki diakrytyczne (ą, ę, ł, ś, ź, ż itd.) są renderowane natywnie przez przeglądarkę. Plik zawiera nagłówek z metadanymi sprawy i stopkę z informacją o aplikacji.

> **Uwaga:** PDF generowany w bieżącej wersji nie zawiera „zaznaczalnego” tekstu – tekst renderowany jest jako obraz. Jeśli potrzebujesz zaznaczalnego tekstu, otwórz pismo w zakładce „Wygenerowane pismo”, skopiuj jego treść i wklej do dowolnego edytora (Word, Google Docs, OnlyOffice).

## Zastrzeżenie prawne

Reklamator AI nie jest kancelarią prawną i nie zastępuje porady prawnika. Pomaga uporządkować informacje i przygotować pismo na podstawie danych wpisanych przez użytkownika. Przed wysłaniem sprawdź poprawność danych. Aplikacja nie gwarantuje konkretnego rozstrzygnięcia sprawy.

W skomplikowanych przypadkach skorzystaj z pomocy:

- powiatowego / miejskiego rzecznika konsumentów,
- Federacji Konsumentów,
- UOKiK (Urząd Ochrony Konkurencji i Konsumentów),
- kancelarii prawnej.

## Ograniczenia MVP

- Brak realnego wysyłania pism (aplikacja jedynie generuje treść do wysyłki przez użytkownika).
- Brak prawdziwego uploadu plików (dowody to opisy + nazwy plików).
- Generator pism jest deterministyczny, oparty o szablony – nie używa AI API.
- Brak synchronizacji między urządzeniami – ręczny eksport/import JSON.
- Brak wbudowanej bazy adresów firm – użytkownik wpisuje dane firmy ręcznie.

## Planowane / przyszłe funkcje

> Funkcje poniżej nie są dostępne w MVP – są listą inspiracji do dalszego rozwoju.

- OCR z screenshotów i PDF-ów (np. odczyt numeru zamówienia ze zdjęcia faktury).
- Opcjonalna integracja z AI (z włącznikiem off-by-default, własny klucz API użytkownika).
- Rozszerzenie do przeglądarki do zapisywania dowodów ze stron i komunikatów.
- Otwarty katalog kanałów kontaktowych firm (adresy reklamacyjne, formularze).
- Śledzenie skuteczności reklamacji.
- Anonimowe statystyki użycia (opt-in).
- Wrapper mobilny (Capacitor / Tauri Mobile).
- Społecznościowa biblioteka szablonów.
- Przycisk darowizny na utrzymanie projektu.

## Licencja

Projekt open-source; możesz uruchomić i dostosować go u siebie. Skonsultuj plik `LICENSE` (jeżeli go nie dodano, dodaj wybraną licencję, np. MIT).
