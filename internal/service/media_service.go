package service

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/config"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/internal/storage"
)

type MediaService struct {
	queries  *sqlc.Queries
	storage  storage.StorageProvider
	cfg      *config.Config
}

func NewMediaService(q *sqlc.Queries, store storage.StorageProvider, cfg *config.Config) *MediaService {
	return &MediaService{
		queries: q,
		storage: store,
		cfg:     cfg,
	}
}

type UploadParams struct {
	Filename string
	Folder   string
	AltText  map[string]string
	Reader   io.Reader
	Size     int64
	UserID   uuid.UUID
}

func (s *MediaService) Upload(ctx context.Context, p UploadParams) (*domain.MediaFile, error) {
	if p.Size > s.cfg.MaxUploadBytes {
		return nil, domain.ErrPayloadTooLarge
	}

	detectedMime, validatedReader, err := storage.SniffAndValidateMime(p.Reader, p.Filename)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	hasher := sha256.New()
	multiWriter := io.MultiWriter(buf, hasher)

	if _, err := io.Copy(multiWriter, validatedReader); err != nil {
		return nil, fmt.Errorf("failed to process file buffer: %w", err)
	}

	hashHex := hex.EncodeToString(hasher.Sum(nil))

	var width, height *int
	if strings.HasPrefix(detectedMime, "image/") && detectedMime != "image/svg+xml" {
		if imgConfig, _, err := image.DecodeConfig(bytes.NewReader(buf.Bytes())); err == nil {
			w := imgConfig.Width
			h := imgConfig.Height
			width = &w
			height = &h
		}
	}

	ext := filepath.Ext(p.Filename)
	fileUUID := uuid.New().String()
	folder := p.Folder
	if folder == "" {
		folder = "general"
	}
	yearMonth := time.Now().Format("2006/01")
	storageKey := fmt.Sprintf("%s/%s/%s%s", folder, yearMonth, fileUUID, ext)

	err = s.storage.Upload(ctx, storageKey, bytes.NewReader(buf.Bytes()), int64(buf.Len()), detectedMime)
	if err != nil {
		return nil, fmt.Errorf("storage provider upload failed: %w", err)
	}

	altJSON, _ := json.Marshal(p.AltText)

	record, err := s.queries.CreateMediaFile(ctx, sqlc.CreateMediaFileParams{
		Filename:         p.Filename,
		OriginalFilename: p.Filename,
		Bucket:           s.cfg.MinIOBucket,
		StorageKey:       storageKey,
		MimeType:         detectedMime,
		FileSize:         int64(buf.Len()),
		Width:            repository.ToPGInt4(width),
		Height:           repository.ToPGInt4(height),
		HashSha256:       hashHex,
		AltText:          altJSON,
		Folder:           folder,
		CreatedBy:        repository.ToPGUUID(&p.UserID),
	})
	if err != nil {
		_ = s.storage.Delete(ctx, storageKey)
		return nil, fmt.Errorf("failed to save media record: %w", err)
	}

	url, _ := s.storage.GetURL(ctx, storageKey, true)

	return &domain.MediaFile{
		ID:               record.ID,
		Filename:         record.Filename,
		OriginalFilename: record.OriginalFilename,
		Bucket:           record.Bucket,
		StorageKey:       record.StorageKey,
		MimeType:         record.MimeType,
		FileSize:         record.FileSize,
		Width:            width,
		Height:           height,
		HashSHA256:       record.HashSha256,
		AltText:          record.AltText,
		Folder:           record.Folder,
		URL:              url,
		CreatedAt:        record.CreatedAt.Time,
		UpdatedAt:        record.UpdatedAt.Time,
	}, nil
}

func (s *MediaService) Replace(ctx context.Context, id uuid.UUID, r io.Reader, filename string, size int64) (*domain.MediaFile, error) {
	record, err := s.queries.GetMediaByID(ctx, id)
	if err != nil {
		return nil, domain.NewNotFoundError("Media file")
	}

	detectedMime, validatedReader, err := storage.SniffAndValidateMime(r, filename)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	hasher := sha256.New()
	multiWriter := io.MultiWriter(buf, hasher)
	if _, err := io.Copy(multiWriter, validatedReader); err != nil {
		return nil, err
	}

	hashHex := hex.EncodeToString(hasher.Sum(nil))

	var width, height *int
	if strings.HasPrefix(detectedMime, "image/") && detectedMime != "image/svg+xml" {
		if imgConfig, _, err := image.DecodeConfig(bytes.NewReader(buf.Bytes())); err == nil {
			w := imgConfig.Width
			h := imgConfig.Height
			width = &w
			height = &h
		}
	}

	err = s.storage.Replace(ctx, record.StorageKey, bytes.NewReader(buf.Bytes()), int64(buf.Len()), detectedMime)
	if err != nil {
		return nil, err
	}

	updated, err := s.queries.ReplaceMediaFile(ctx, sqlc.ReplaceMediaFileParams{
		ID:               id,
		OriginalFilename: filename,
		MimeType:         detectedMime,
		FileSize:         int64(buf.Len()),
		Width:            repository.ToPGInt4(width),
		Height:           repository.ToPGInt4(height),
		HashSha256:       hashHex,
	})
	if err != nil {
		return nil, err
	}

	url, _ := s.storage.GetURL(ctx, updated.StorageKey, true)

	return &domain.MediaFile{
		ID:               updated.ID,
		Filename:         updated.Filename,
		OriginalFilename: updated.OriginalFilename,
		Bucket:           updated.Bucket,
		StorageKey:       updated.StorageKey,
		MimeType:         updated.MimeType,
		FileSize:         updated.FileSize,
		Width:            width,
		Height:           height,
		HashSHA256:       updated.HashSha256,
		AltText:          updated.AltText,
		Folder:           updated.Folder,
		URL:              url,
		CreatedAt:        updated.CreatedAt.Time,
		UpdatedAt:        updated.UpdatedAt.Time,
	}, nil
}

func (s *MediaService) List(ctx context.Context, folder, mimeType, search string, limit, offset int) ([]domain.MediaFile, int64, error) {
	rows, err := s.queries.ListMediaFiles(ctx, sqlc.ListMediaFilesParams{
		Folder:   repository.ToPGTextFromString(folder),
		MimeType: repository.ToPGTextFromString(mimeType),
		Search:   repository.ToPGTextFromString(search),
		Limit:    int32(limit),
		Offset:   int32(offset),
	})
	if err != nil {
		return nil, 0, err
	}

	total, err := s.queries.CountMediaFiles(ctx, sqlc.CountMediaFilesParams{
		Folder:   repository.ToPGTextFromString(folder),
		MimeType: repository.ToPGTextFromString(mimeType),
		Search:   repository.ToPGTextFromString(search),
	})
	if err != nil {
		return nil, 0, err
	}

	items := make([]domain.MediaFile, len(rows))
	for i, r := range rows {
		url, _ := s.storage.GetURL(ctx, r.StorageKey, true)

		items[i] = domain.MediaFile{
			ID:               r.ID,
			Filename:         r.Filename,
			OriginalFilename: r.OriginalFilename,
			Bucket:           r.Bucket,
			StorageKey:       r.StorageKey,
			MimeType:         r.MimeType,
			FileSize:         r.FileSize,
			Width:            repository.FromPGInt4(r.Width),
			Height:           repository.FromPGInt4(r.Height),
			HashSHA256:       r.HashSha256,
			AltText:          r.AltText,
			Folder:           r.Folder,
			URL:              url,
			UploaderName:     repository.FromPGText(r.UploaderName),
			CreatedAt:        r.CreatedAt.Time,
			UpdatedAt:        r.UpdatedAt.Time,
		}
	}

	return items, total, nil
}

func (s *MediaService) SoftDelete(ctx context.Context, id uuid.UUID) error {
	return s.queries.SoftDeleteMedia(ctx, id)
}
