# Pixaku-Spielepaket: Quellcode

Dieses Verzeichnis enthält den Quellcode. Die fertige Web-App liegt im Wurzelverzeichnis des Repositorys und wird von dort ausgeliefert.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `shell/` | Rahmen der App: Seitengerüst, Stil, Startseite, Einstellungen, Speicher, Ton, Schriften. Enthält derzeit noch die Oberfläche von Pixaku. |
| `games/pixaku/` | Pixaku: Rätselgenerator, Motive, 3D-Brett |
| `games/quest/` | Pias Quest: Regeln und Generator (`labcore.js`), Spiel und 3D (`lab.js`), Bosse (`boss.js`, `boss2.js`), Filme (`cine.js`) |
| `tools/` | Bau der HTML-Datei, Bau der Web-App, Veröffentlichung |
| `tests/unit/` | Regeltests, laufen ohne Browser |
| `tests/e2e/` | Spieltest im Browser mit Bots |
| `tests/golden/` | Festgehaltener Stand aller Level und Rätsel |

## Befehle

```
npm install                # einmalig
npm test                   # 52 Regeltests, etwa eine halbe Minute
npm run build              # dist/index.html und dist/pwa
npm run test:browser       # Spieltest, etwa drei Minuten
npm run test:browser:alles # mit allen Bosskämpfen und Filmen, etwa 15 Minuten
npm run release            # Tests, Bau, Spieltest, dann Kopie ins Wurzelverzeichnis
```

Ändert sich der Levelgenerator absichtlich, wird der festgehaltene Stand mit `UPDATE_GOLDEN=1 npm test` erneuert.
