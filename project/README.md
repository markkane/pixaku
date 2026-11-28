# Pixaku-Spielepaket: Quellcode

Dieses Verzeichnis enthält den Quellcode. Die fertige Web-App liegt im Wurzelverzeichnis des Repositorys und wird von dort ausgeliefert.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `shell/` | Der Rahmen: Seitengerüst (`index.html.tpl`), Grundstil und Looks (`css/`), Startseite (`html/home.html`, `js/home.js`), Speicher, Ton, Blätter und Navigation (`js/app.js`), Schnittstelle zu den Spielen (`js/games.js`), Start (`js/boot.js`) |
| `games/pixaku/` | Pixaku: Rätselgenerator (`core.js`), 3D-Brett (`r3.js`), Oberfläche in `js/`, eigene Bildschirme in `html/`, eigener Stil in `css/` |
| `games/quest/` | Pias Quest: Regeln und Generator (`labcore.js`), Spiel und 3D (`lab.js`), Bosse, Filme, eigene Bildschirme und Stil |
| `tools/` | Bau der HTML-Datei, Bau der Web-App, Veröffentlichung |
| `tests/` | Regeltests (`unit/`), Spieltest im Browser (`e2e/`), festgehaltener Stand (`golden/`) |

Das Gerüst `shell/index.html.tpl` besteht nur aus Zeilen der Form `%%INCLUDE pfad%%`. Der Bau setzt die Dateien in dieser Reihenfolge zu einer einzigen HTML-Datei zusammen.

## Schnittstelle zwischen Rahmen und Spiel

Ein Spiel meldet sich mit `Shell.register({...})` an. Der Rahmen kennt keine Spielnamen und ruft nur diese Felder auf. Die Beschreibung steht auch in `shell/js/games.js`.

| Feld | Pflicht | Zweck |
|---|---|---|
| `id`, `name`, `tagline` | ja | Kennung, Anzeigename, Zeile unter dem Schriftzug |
| `logo(anim, run)` | ja | zeichnet den Schriftzug in `#logo` |
| `hero()` | ja | startet die Vorschau in `#hero` |
| `init()` | nein | einmal beim Start |
| `onHome()` | nein | vor jedem Anzeigen der Startseite |
| `onShow(id)` | nein | nach jedem Bildschirmwechsel |
| `onBack()` | nein | Zurück-Taste, liefert `true`, wenn behandelt |
| `onResize()`, `onWake()` | nein | Fenstergröße geändert, App aus der Pause zurück |
| `settingsRows()`, `settingsBind(el)` | nein | eigene Zeilen in den Einstellungen |
| `scrollScreens` | nein | eigene Bildschirme mit scrollbarem Inhalt |

Das Menü eines Spiels liegt in `games/<id>/html/menu.html`. Der Rahmen zeigt nur das Menü des gewählten Spiels.

### Ein neues Spiel anlegen

1. Ordner `games/<id>/` mit `js/`, `html/menu.html`, bei Bedarf `html/screens.html` und `css/`.
2. Die Dateien im Gerüst `shell/index.html.tpl` eintragen und das Menü in `shell/html/home.html` in einem `<div class="gmenu" data-game="<id>">` einbinden.
3. Am Ende des Spielcodes `Shell.register({...})` aufrufen.
4. Regeltests unter `tests/unit/` ergänzen, den Spieltest um Start und einen Durchlauf erweitern.

### Bekannte Reste

- Die Einstellungen (`openSettings`) und das Tutorial liegen noch in `games/pixaku/js/`, obwohl sie zum Rahmen gehören.
- `shell/css/base.css` und `skins.css` enthalten noch Stilregeln für Pixakus Spielbildschirm.
- Alle Spiele teilen sich einen Speicherbereich mit dem Präfix `pixaku.`. Schlüssel umzubenennen würde gespeicherte Spielstände löschen.
- Pias Quest nutzt den Zufallsgenerator aus `games/pixaku/core.js`.

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
