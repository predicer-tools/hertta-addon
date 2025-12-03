ARG BUILD_FROM
FROM $BUILD_FROM

USER root

RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash \
    tzdata

WORKDIR /usr/src/app

COPY --from=rust_builder /build/target/release/hass-backend /usr/local/bin/hass-backend
COPY --from=rust_builder /build/target/release/hertta /usr/local/bin/hertta

COPY hertta ./hertta

RUN if [ -f ./hertta/requirements.txt ]; then \
      pip3 install --no-cache-dir -r ./hertta/requirements.txt; \
    fi

COPY --from=frontend_builder /frontend/dist ./hertta-frontend-dist

COPY run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 4001
CMD ["/run.sh"]
