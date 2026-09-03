package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	AppEnv         string
	Port           int
	BaseURL        string
	DatabaseURL    string
	StorageDriver  string // "minio" or "local"
	StorageBaseDir string // for local storage fallback
	MinIOEndpoint  string
	MinIOAccessKey string
	MinIOSecretKey string
	MinIOBucket    string
	MinIOUseSSL    bool
	SessionSecret  string
	SessionTTL     time.Duration
	CookieSecure   bool
	CookieDomain   string
	CORSAllowed    []string
	MaxUploadBytes int64
}

func Load() *Config {
	return &Config{
		AppEnv:         getEnv("APP_ENV", "development"),
		Port:           getEnvInt("PORT", 8080),
		BaseURL:        getEnv("BASE_URL", "http://localhost:8080"),
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/lohakit_cms?sslmode=disable"),
		StorageDriver:  getEnv("STORAGE_DRIVER", "local"), // default to local, can be switched to minio
		StorageBaseDir: getEnv("STORAGE_BASE_DIR", "./storage/uploads"),
		MinIOEndpoint:  getEnv("MINIO_ENDPOINT", "localhost:9000"),
		MinIOAccessKey: getEnv("MINIO_ACCESS_KEY", "minioadmin"),
		MinIOSecretKey: getEnv("MINIO_SECRET_KEY", "minioadmin"),
		MinIOBucket:    getEnv("MINIO_BUCKET", "lohakit-media"),
		MinIOUseSSL:    getEnvBool("MINIO_USE_SSL", false),
		SessionSecret:  getEnv("SESSION_SECRET", "super-secret-key-change-in-production-min32bytes"),
		SessionTTL:     time.Duration(getEnvInt("SESSION_TTL_HOURS", 24)) * time.Hour,
		CookieSecure:   getEnvBool("COOKIE_SECURE", false), // true in prod
		CookieDomain:   getEnv("COOKIE_DOMAIN", ""),
		CORSAllowed:    strings.Split(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:8080"), ","),
		MaxUploadBytes: int64(getEnvInt("MAX_UPLOAD_MB", 50)) * 1024 * 1024,
	}
}

func (c *Config) IsProduction() bool {
	return strings.ToLower(c.AppEnv) == "production"
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		if intVal, err := strconv.Atoi(val); err == nil {
			return intVal
		}
	}
	return defaultVal
}

func getEnvBool(key string, defaultVal bool) bool {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		if boolVal, err := strconv.ParseBool(val); err == nil {
			return boolVal
		}
	}
	return defaultVal
}
