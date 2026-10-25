#!/bin/sh
# Écrit dist/config.json à partir des variables d'environnement de l'app.
#
# Une app statique n'a pas accès aux variables d'environnement dans le navigateur :
# sur Clever Cloud, ce script tourne en CC_PRE_RUN_HOOK, donc avant chaque démarrage
# (déploiement ET clever restart), et l'app React lit le fichier avec fetch(no-store).
# Aucune dépendance : sh, sed, tr et date suffisent.
#
# Usage local : APP_ENV=production ANNOUNCEMENT="Bonjour" sh scripts/write-config.sh
set -eu

cd "$(dirname "$0")/.."
webroot="${CC_WEBROOT:-/dist}"
webroot="${webroot#/}"
out="${webroot:-.}/config.json"

# Échappe une valeur pour une chaîne JSON : \ et " échappés, sauts de ligne et tabulations
# remplacés par une espace, autres caractères de contrôle retirés (octets UTF-8 conservés).
json() {
  printf '%s' "$1" | LC_ALL=C tr '\n\r\t' '   ' | LC_ALL=C tr -d '\000-\037' |
    LC_ALL=C sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

tmp="$out.tmp"
{
  printf '{\n'
  printf '  "source": "CC_PRE_RUN_HOOK",\n'
  printf '  "generated_at": "%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  for key in APP_ENV ANNOUNCEMENT CLUB_NAME GOAL_PACE \
             APP_ID CC_APP_NAME INSTANCE_NUMBER CC_PRETTY_INSTANCE_NAME INSTANCE_TYPE \
             CC_COMMIT_ID CC_DEPLOYMENT_ID; do
    eval "value=\${$key:-}"
    sep=","
    [ "$key" = "CC_DEPLOYMENT_ID" ] && sep=""
    printf '  "%s": "%s"%s\n' "$key" "$(json "$value")" "$sep"
  done
  printf '}\n'
} > "$tmp"
mv "$tmp" "$out"
echo "write-config: $out écrit (APP_ENV=${APP_ENV:-local})"
