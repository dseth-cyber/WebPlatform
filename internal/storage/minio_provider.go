package storage

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"time"

	"github.com/lohakit/cms-backend/internal/config"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinIOProvider struct {
	client *minio.Client
	bucket string
}

func NewMinIOProvider(cfg *config.Config) (*MinIOProvider, error) {
	client, err := minio.New(cfg.MinIOEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.MinIOAccessKey, cfg.MinIOSecretKey, ""),
		Secure: cfg.MinIOUseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize minio client: %w", err)
	}

	// Ensure bucket exists
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	exists, err := client.BucketExists(ctx, cfg.MinIOBucket)
	if err != nil {
		// If MinIO is not reachable at startup, return provider with warning or retry
	} else if !exists {
		err = client.MakeBucket(ctx, cfg.MinIOBucket, minio.MakeBucketOptions{})
		if err != nil {
			return nil, fmt.Errorf("failed to auto-create bucket %s: %w", cfg.MinIOBucket, err)
		}
	}

	return &MinIOProvider{
		client: client,
		bucket: cfg.MinIOBucket,
	}, nil
}

func (m *MinIOProvider) Upload(ctx context.Context, key string, r io.Reader, size int64, contentType string) error {
	cleanKey, err := SanitizeKey(key)
	if err != nil {
		return err
	}

	opts := minio.PutObjectOptions{
		ContentType: contentType,
	}

	_, err = m.client.PutObject(ctx, m.bucket, cleanKey, r, size, opts)
	return err
}

func (m *MinIOProvider) Download(ctx context.Context, key string) (io.ReadCloser, error) {
	cleanKey, err := SanitizeKey(key)
	if err != nil {
		return nil, err
	}

	return m.client.GetObject(ctx, m.bucket, cleanKey, minio.GetObjectOptions{})
}

func (m *MinIOProvider) Delete(ctx context.Context, key string) error {
	cleanKey, err := SanitizeKey(key)
	if err != nil {
		return err
	}

	return m.client.RemoveObject(ctx, m.bucket, cleanKey, minio.RemoveObjectOptions{})
}

func (m *MinIOProvider) Move(ctx context.Context, srcKey, dstKey string) error {
	if err := m.Copy(ctx, srcKey, dstKey); err != nil {
		return err
	}
	return m.Delete(ctx, srcKey)
}

func (m *MinIOProvider) Copy(ctx context.Context, srcKey, dstKey string) error {
	cleanSrc, err := SanitizeKey(srcKey)
	if err != nil {
		return err
	}
	cleanDst, err := SanitizeKey(dstKey)
	if err != nil {
		return err
	}

	srcOpts := minio.CopySrcOptions{
		Bucket: m.bucket,
		Object: cleanSrc,
	}
	dstOpts := minio.CopyDestOptions{
		Bucket: m.bucket,
		Object: cleanDst,
	}

	_, err = m.client.CopyObject(ctx, dstOpts, srcOpts)
	return err
}

func (m *MinIOProvider) GetMetadata(ctx context.Context, key string) (*FileMetadata, error) {
	cleanKey, err := SanitizeKey(key)
	if err != nil {
		return nil, err
	}

	info, err := m.client.StatObject(ctx, m.bucket, cleanKey, minio.StatObjectOptions{})
	if err != nil {
		return nil, err
	}

	return &FileMetadata{
		Key:          cleanKey,
		Size:         info.Size,
		ContentType:  info.ContentType,
		LastModified: info.LastModified,
	}, nil
}

func (m *MinIOProvider) GetURL(ctx context.Context, key string, isPublic bool) (string, error) {
	cleanKey, err := SanitizeKey(key)
	if err != nil {
		return "", err
	}

	if isPublic {
		return fmt.Sprintf("/%s/%s", m.bucket, cleanKey), nil
	}

	reqParams := make(url.Values)
	presignedURL, err := m.client.PresignedGetObject(ctx, m.bucket, cleanKey, 1*time.Hour, reqParams)
	if err != nil {
		return "", err
	}

	return presignedURL.String(), nil
}

func (m *MinIOProvider) Replace(ctx context.Context, key string, r io.Reader, size int64, contentType string) error {
	return m.Upload(ctx, key, r, size, contentType)
}
