#!/bin/sh
set -e

envsubst '${VITE_API_URL}' \
  < /usr/share/nginx/html/env-config.js \
  > /tmp/env-config.js

cat /tmp/env-config.js > /usr/share/nginx/html/env-config.js

exec nginx -g 'daemon off;'
