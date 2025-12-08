# ---------- 0) Global build arg used by Home Assistant ----------
# Supervisor overrides this from build.yaml, but this default
# also makes local "docker build" work.
ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base:latest

# ---------- 1) Build Rust binaries ----------
FROM rust:alpine AS rust_builder

# Toolchain + OpenSSL (incl. static libs) for hass-backend & hertta
RUN apk add --no-cache \
    musl-dev \
    openssl-dev \
    openssl-libs-static \
    pkgconfig \
    build-base

WORKDIR /build

# Copy the whole repo (incl. submodules)
COPY . .

# Build hass-backend crate
RUN cd hass-backend && cargo build --release

# Build hertta crate
RUN cd hertta && cargo build --release


# ---------- 2) Build React frontend (Create React App) ----------
FROM node:alpine AS frontend_builder

WORKDIR /frontend

# Install dependencies first (better caching)
COPY hertta-frontend/package*.json ./
RUN npm ci

# Copy the rest of the frontend and build
COPY hertta-frontend/ .
# CRA puts output into /frontend/build
RUN npm run build


# ---------- 3) Final runtime image (Home Assistant base) ----------
FROM ${BUILD_FROM}

USER root

# Only what we actually need at runtime
RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash

WORKDIR /usr/src/app

# ---- Rust binaries ----
COPY --from=rust_builder /build/hass-backend/target/release/hass-backend /usr/local/bin/hass-backend
COPY --from=rust_builder /build/hertta/target/release/hertta /usr/local/bin/hertta

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
