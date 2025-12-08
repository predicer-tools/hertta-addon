#!/usr/bin/with-contenv bashio
set -euo pipefail

LOG_LEVEL=$(bashio::config 'log_level')
bashio::log.info "Starting Hertta add-on (log level: ${LOG_LEVEL})"

# ---- Environment for both services ----

# Let Rust do logging if you use env_logger/tracing-subscriber
export RUST_LOG="${LOG_LEVEL}"

# Home Assistant Core API base inside an add-on container
export HASS_BASE_URL="http://supervisor/core/api"

export HERTTA_GRAPHQL_URL="http://127.0.0.1:3030/graphql"


# ---- Start Hertta GraphQL backend (warp on 127.0.0.1:3030) ----
bashio::log.info "Starting Hertta GraphQL backend on 127.0.0.1:3030..."
hertta &
HERTTA_PID=$!

# ---- Start Hass backend (axum on 0.0.0.0:4001) ----
bashio::log.info "Starting Hass backend on 0.0.0.0:4001..."
hass-backend &
HASS_PID=$!

PIDS=("${HERTTA_PID}" "${HASS_PID}")

# ---- Start Frontend HTTP server (serving static build) ----
FRONTEND_PORT=8099

bashio::log.info "Starting Hertta frontend on 0.0.0.0:${FRONTEND_PORT}..."
cd /usr/src/app/hertta-frontend-dist
python3 -m http.server "${FRONTEND_PORT}" &
FRONTEND_PID=$!

# Return to app root
cd /usr/src/app

PIDS+=("${FRONTEND_PID}")


# ---- Graceful shutdown ----
term_handler() {
  bashio::log.info "Stopping Hertta add-on processes..."
  for pid in "${PIDS[@]}"; do
    if kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
    fi
  done
}

trap term_handler SIGTERM SIGINT

wait -n || true
bashio::log.warning "One of the processes exited; shutting down..."
term_handler
wait || true
bashio::log.info "Hertta add-on stopped."
