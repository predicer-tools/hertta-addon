# ---------- 1) Build Rust binaries ----------
FROM rust:1.81-alpine AS rust_builder
RUN apk add --no-cache musl-dev openssl-dev pkgconfig

WORKDIR /build

# Copy the whole repo (including submodules)
COPY . .

# Build hass-backend and hertta from workspace
RUN cargo build --release --bin hass-backend --bin hertta


# ---------- 2) Build React frontend (CRA) ----------
FROM node:22-alpine AS frontend_builder

WORKDIR /frontend

COPY hertta-frontend/package*.json ./
RUN npm ci

COPY hertta-frontend/ .
RUN npm run build
# CRA puts output into /frontend/build


# ---------- 3) Final runtime image (Home Assistant base) ----------
ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base:latest
FROM ${BUILD_FROM}


USER root

# Only what we actually need at runtime
RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash

WORKDIR /usr/src/app

# ---- Rust binaries ----
COPY --from=rust_builder /build/target/release/hass-backend /usr/local/bin/hass-backend
COPY --from=rust_builder /build/target/release/hertta /usr/local/bin/hertta

# ---- Python code & deps (optional) ----
COPY hertta ./hertta
RUN if [ -f ./hertta/requirements.txt ]; then \
      pip3 install --no-cache-dir -r ./hertta/requirements.txt; \
    fi

# ---- Frontend static files (CRA: build/) ----
COPY --from=frontend_builder /frontend/build ./hertta-frontend-dist

# ---- Entrypoint ----
COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 4001
CMD ["/run.sh"]
