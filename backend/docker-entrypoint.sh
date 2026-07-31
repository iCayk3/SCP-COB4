#!/bin/sh
set -eu

read_secret() {
  variable="$1"
  file_variable="${variable}_FILE"
  eval "file_path=\${$file_variable:-}"
  if [ -n "$file_path" ]; then
    [ -r "$file_path" ] || { echo "Secret file not readable: $file_path" >&2; exit 1; }
    value=$(cat "$file_path")
    export "$variable=$value"
  fi
}

read_secret POSTGRES_PASSWORD
read_secret SGC_JWT_SECRET
read_secret SGC_USUARIO_INICIAL_SENHA
read_secret SGC_LGPD_ANEXOS_CHAVE

exec java -XX:MaxRAMPercentage=75 -jar /app/app.jar
