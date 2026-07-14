#!/bin/sh
# Generates the runtime config the panel expects (window.__APP_CONFIG__) from the
# container's VITE_* env vars, keeping the full VITE_ key names. The same image
# runs in any environment; only these env vars change.

CONFIG_FILE="/usr/share/nginx/html/config.js"

echo "window.__APP_CONFIG__ = {" > "$CONFIG_FILE"

FIRST=1
for VAR in $(env | grep '^VITE_' | cut -d= -f1); do
  VALUE=$(printenv "$VAR")
  ESCAPED_VALUE=$(printf '%s' "$VALUE" | sed 's/\\/\\\\/g; s/"/\\"/g')

  if [ $FIRST -eq 1 ]; then
    FIRST=0
  else
    echo "," >> "$CONFIG_FILE"
  fi

  printf '  %s: "%s"' "$VAR" "$ESCAPED_VALUE" >> "$CONFIG_FILE"
done

echo "" >> "$CONFIG_FILE"
echo "};" >> "$CONFIG_FILE"

nginx -g "daemon off;"
