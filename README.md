# Capys Zahlenwelt 🦫

Ein Mathespiel im Duolingo-Stil für Grundschüler (Klasse 1–4) zum Üben des kleinen Einmaleins.

## Features

- Levelpfad mit 27 Leveln in didaktischer Reihenfolge (1er, 2er, 5er, 10er, dann 3, 4, 6, 7, 8, 9)
- Pro Reihe: Lern- und Übungslevel, dazwischen Wiederholungslevel, am Ende 3 gemischte Abschlusslevel
- 5 Aufgabentypen: Auswahl, Zahleneingabe, Umkehraufgaben, Richtig/Falsch, Paare finden
- 10 Aufgaben pro Level, 8 richtige (beim ersten Versuch) zum Bestehen, 1–3 Sterne
- Falsche Aufgaben kommen am Ende des Levels nochmal dran
- Capybara-Maskottchen "Capy" mit Reaktionen und Rechentipps
- Tägliche Streak 🔥, mehrere Profile pro Gerät, alles ohne Anmeldung (localStorage)
- Soundeffekte + Vorlesen der Aufgaben (Stumm-Schalter oben rechts)
- Funktioniert auf Handy, Tablet und Desktop

## Auf GitHub Pages veröffentlichen

Der fertige Build liegt schon im Ordner `docs/`. So geht's:

1. Neues Repository auf github.com anlegen (z. B. `einmaleins-abenteuer`)
2. Diesen Ordner hochladen (per Git oder über "uploading an existing file" auf GitHub)
3. Im Repository: **Settings → Pages**
4. Bei "Build and deployment": Source = **Deploy from a branch**, Branch = **main**, Ordner = **/docs**, dann **Save**
5. Nach 1–2 Minuten ist das Spiel erreichbar unter:
   `https://DEIN-BENUTZERNAME.github.io/einmaleins-abenteuer/`

## Entwicklung (nur nötig, wenn du etwas ändern willst)

Voraussetzung: [Node.js](https://nodejs.org)

```bash
npm install     # einmalig
npm run dev     # lokaler Testserver
npm run build   # neuen Build in docs/ erzeugen (danach committen & pushen)
```

## Hinweis zum Spielstand

Der Fortschritt wird im Browser des Geräts gespeichert (localStorage). Er bleibt beim Neustart erhalten, geht aber verloren, wenn die Browserdaten gelöscht werden oder ein anderes Gerät/Browser benutzt wird.
