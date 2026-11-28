#!/usr/bin/env bash
# Veröffentlichen nur, wenn alle Prüfungen bestehen: Regeltests, Bau, Spieltest im Browser.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "1/4 Regeltests";   node --test tests/unit/*.test.js > /tmp/px-unit.log 2>&1 || { grep -E "^not ok|error" /tmp/px-unit.log | head -20; echo "ABBRUCH: Regeltests fehlgeschlagen"; exit 1; }
echo "2/4 Bau";          python3 tools/build.py && python3 tools/build_pwa.py > /dev/null
echo "3/4 Spieltest";    python3 tests/e2e/smoke.py "${1:-schnell}" > /tmp/px-e2e.log 2>&1 || { grep FEHLER /tmp/px-e2e.log | head -20; echo "ABBRUCH: Spieltest fehlgeschlagen"; exit 1; }
tail -1 /tmp/px-e2e.log
echo "4/4 Web-App in das Wurzelverzeichnis kopieren"
cp -r dist/pwa/. ../ && rm -f ../LIESMICH.txt
echo "Fertig. Jetzt committen und pushen."
