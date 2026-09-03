package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type LocalProvider struct {
	baseDir string
	baseURL string
}

func NewLocalProvider(baseDir, baseURL string) (*LocalProvider, error) {
	if err := os.MkdirAll(baseDir, 0750); err != nil {
		return nil, fmt.Errorf("failed to create storage directory: %w", err)
	}
	return &LocalProvider{
		baseDir: baseDir,
		baseURL: baseURL,
	}, nil
}

func (l *LocalProvider) getFullPath(key string) (string, error) {
	cleanKey, err := SanitizeKey(key)
	if err != nil {
		return "", err
	}
	return filepath.Join(l.baseDir, filepath.FromSlash(cleanKey)), nil
}

func (l *LocalProvider) Upload(ctx context.Context, key string, r io.Reader, size int64, contentType string) error {
	fullPath, err := l.getFullPath(key)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(fullPath), 0750); err != nil {
		return fmt.Errorf("failed to create target folder: %w", err)
	}

	file, err := os.OpenFile(fullPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0640)
	if err != nil {
		return fmt.Errorf("failed to create file on disk: %w", err)
	}
	defer file.Close()

	if _, err := io.Copy(file, r); err != nil {
		return fmt.Errorf("failed to write data: %w", err)
	}

	return nil
}

func (l *LocalProvider) Download(ctx context.Context, key string) (io.ReadCloser, error) {
	fullPath, err := l.getFullPath(key)
	if err != nil {
		return nil, err
	}
	return os.Open(fullPath)
}

func (l *LocalProvider) Delete(ctx context.Context, key string) error {
	fullPath, err := l.getFullPath(key)
	if err != nil {
		return err
	}
	err = os.Remove(fullPath)
	if err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}

func (l *LocalProvider) Move(ctx context.Context, srcKey, dstKey string) error {
	srcPath, err := l.getFullPath(srcKey)
	if err != nil {
		return err
	}
	dstPath, err := l.getFullPath(dstKey)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(dstPath), 0750); err != nil {
		return err
	}

	return os.Rename(srcPath, dstPath)
}

func (l *LocalProvider) Copy(ctx context.Context, srcKey, dstKey string) error {
	srcPath, err := l.getFullPath(srcKey)
	if err != nil {
		return err
	}
	dstPath, err := l.getFullPath(dstKey)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(dstPath), 0750); err != nil {
		return err
	}

	srcFile, err := os.Open(srcPath)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	dstFile, err := os.OpenFile(dstPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0640)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	_, err = io.Copy(dstFile, srcFile)
	return err
}

func (l *LocalProvider) GetMetadata(ctx context.Context, key string) (*FileMetadata, error) {
	fullPath, err := l.getFullPath(key)
	if err != nil {
		return nil, err
	}

	info, err := os.Stat(fullPath)
	if err != nil {
		return nil, err
	}

	return &FileMetadata{
		Key:          key,
		Size:         info.Size(),
		LastModified: info.ModTime(),
	}, nil
}

func (l *LocalProvider) GetURL(ctx context.Context, key string, isPublic bool) (string, error) {
	cleanKey, err := SanitizeKey(key)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/storage/%s", l.baseURL, cleanKey), nil
}

func (l *LocalProvider) Replace(ctx context.Context, key string, r io.Reader, size int64, contentType string) error {
	return l.Upload(ctx, key, r, size, contentType)
}
