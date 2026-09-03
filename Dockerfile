# Build Stage
FROM golang:alpine AS builder

ENV GOTOOLCHAIN=auto
WORKDIR /app

# Install certificates and git
RUN apk add --no-cache ca-certificates git tzdata

# Cache Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s -X main.version=1.0.0" \
    -o /app/bin/server ./cmd/server

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o /app/bin/seeder ./cmd/seeder

# Production Minimal Stage
FROM alpine:3.21

WORKDIR /app

# Install CA certificates & Timezone support
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy binaries and assets
COPY --from=builder /app/bin/server /app/server
COPY --from=builder /app/bin/seeder /app/seeder
COPY --from=builder /app/migrations /app/migrations

# Create storage directory and set permissions
RUN mkdir -p /app/storage/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

ENTRYPOINT ["/app/server"]
