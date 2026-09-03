package storage

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/lohakit/cms-backend/internal/config"
)

type FileMetadata struct {
	Key          string
	Size         int64
	ContentType  string
	LastModified time.Time
}

// StorageProvider is the vendor-independent storage interface
type StorageProvider interface {
	Upload(ctx context.Context, key string, r io.Reader, size int64, contentType string) error
	Download(ctx context.Context, key string) (io.ReadCloser, error)
	Delete(ctx context.Context, key string) error
	Move(ctx context.Context, srcKey, dstKey string) error
	Copy(ctx context.Context, srcKey, dstKey string) error
	GetMetadata(ctx context.Context, key string) (*FileMetadata, error)
	GetURL(ctx context.Context, key string, isPublic bool) (string, error)
	Replace(ctx context.Context, key string, r io.Reader, size int64, contentType string) error
}

// GetStorageProvider returns the configured storage provider (MinIO/S3 or Local)
func GetStorageProvider(cfg *config.Config) (StorageProvider, error) {
	switch cfg.StorageDriver {
	case "minio", "s3":
		return NewMinIOProvider(cfg)
	case "local":
		return NewLocalProvider(cfg.StorageBaseDir, cfg.BaseURL)
	default:
		return nil, fmt.Errorf("unsupported storage driver: %s", cfg.StorageDriver)
	}
}
