package storage

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/lohakit/cms-backend/internal/domain"
)

var (
	ErrDisallowedMimeType = errors.New("file type not allowed")
	ErrCorruptHeader      = errors.New("file content signature does not match declared MIME type")
	ErrPathTraversal      = errors.New("path traversal attempt detected")
)

// Allowed MIME types mapped to their valid extensions
var AllowedMimeTypes = map[string][]string{
	"image/jpeg":      {".jpg", ".jpeg"},
	"image/png":       {".png"},
	"image/webp":      {".webp"},
	"image/svg+xml":   {".svg"},
	"application/pdf": {".pdf"},
	"video/mp4":       {".mp4"},
	"video/webm":      {".webm"},
}

// Magic byte signatures
var (
	magicJPEG = []byte{0xFF, 0xD8, 0xFF}
	magicPNG  = []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}
	magicPDF  = []byte{0x25, 0x50, 0x44, 0x46} // %PDF
	magicWebM = []byte{0x1A, 0x45, 0xDF, 0xA3} // EBML
)

// SanitizeKey validates and cleans storage keys preventing directory traversal
func SanitizeKey(key string) (string, error) {
	clean := filepath.Clean(key)
	if strings.Contains(clean, "..") || strings.HasPrefix(clean, "/") || strings.HasPrefix(clean, "\\") {
		return "", ErrPathTraversal
	}
	// Convert Windows backslashes to forward slashes for cross-platform/S3 consistency
	return filepath.ToSlash(clean), nil
}

// SniffAndValidateMime reads initial header bytes to verify MIME type and magic signatures
func SniffAndValidateMime(r io.Reader, declaredFilename string) (string, io.Reader, error) {
	header := make([]byte, 512)
	n, err := io.ReadFull(r, header)
	if err != nil && err != io.EOF && err != io.ErrUnexpectedEOF {
		return "", nil, fmt.Errorf("failed to read file header: %w", err)
	}

	combinedReader := io.MultiReader(bytes.NewReader(header[:n]), r)
	data := header[:n]

	// Sniff MIME type using standard lib
	detectedMime := http.DetectContentType(data)

	// SVG special handling (plain text or xml)
	ext := strings.ToLower(filepath.Ext(declaredFilename))
	if ext == ".svg" && (strings.Contains(detectedMime, "text/xml") || strings.Contains(detectedMime, "text/plain")) {
		lowerData := strings.ToLower(string(data))
		if strings.Contains(lowerData, "<svg") {
			detectedMime = "image/svg+xml"
		}
	}

	// Verify against allowed list
	allowedExts, ok := AllowedMimeTypes[detectedMime]
	if !ok {
		return "", nil, fmt.Errorf("%w: detected %s", domain.ErrInvalidFileType, detectedMime)
	}

	// Verify magic signature match for binaries
	switch detectedMime {
	case "image/jpeg":
		if len(data) >= 3 && !bytes.Equal(data[:3], magicJPEG) {
			return "", nil, ErrCorruptHeader
		}
	case "image/png":
		if len(data) >= 8 && !bytes.Equal(data[:8], magicPNG) {
			return "", nil, ErrCorruptHeader
		}
	case "application/pdf":
		if len(data) >= 4 && !bytes.Equal(data[:4], magicPDF) {
			return "", nil, ErrCorruptHeader
		}
	case "video/webm":
		if len(data) >= 4 && !bytes.Equal(data[:4], magicWebM) {
			return "", nil, ErrCorruptHeader
		}
	}

	// Verify extension compatibility
	extMatch := false
	for _, aExt := range allowedExts {
		if ext == aExt {
			extMatch = true
			break
		}
	}
	if !extMatch {
		return "", nil, fmt.Errorf("%w: extension %s does not match content type %s", domain.ErrInvalidFileType, ext, detectedMime)
	}

	return detectedMime, combinedReader, nil
}
