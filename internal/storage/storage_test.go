package storage

import (
	"bytes"
	"context"
	"os"
	"testing"
)

func TestStorageValidator_PathSanitization(t *testing.T) {
	_, err := SanitizeKey("../../etc/passwd")
	if err == nil {
		t.Error("Expected error for directory traversal attempt, got nil")
	}

	clean, err := SanitizeKey("images/2026/09/tin-can-food-grade.png")
	if err != nil {
		t.Fatalf("Unexpected error for valid key: %v", err)
	}
	if clean != "images/2026/09/tin-can-food-grade.png" {
		t.Errorf("Expected clean key, got %s", clean)
	}
}

func TestStorageValidator_MimeSniffing(t *testing.T) {
	// Valid PNG header
	validPNG := []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00}
	mime, _, err := SniffAndValidateMime(bytes.NewReader(validPNG), "can.png")
	if err != nil {
		t.Fatalf("Failed to validate genuine PNG: %v", err)
	}
	if mime != "image/png" {
		t.Errorf("Expected image/png, got %s", mime)
	}

	// Mismatched extension
	_, _, err = SniffAndValidateMime(bytes.NewReader(validPNG), "can.jpg")
	if err == nil {
		t.Error("Expected error for PNG content disguised as JPG, got nil")
	}

	// Disallowed file type (.exe)
	fakeExe := []byte("MZThisIsAnExecutable")
	_, _, err = SniffAndValidateMime(bytes.NewReader(fakeExe), "malware.exe")
	if err == nil {
		t.Error("Expected error for disallowed .exe file type, got nil")
	}
}

func TestLocalStorageProvider_CRUD(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "lohakit-storage-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	provider, err := NewLocalProvider(tempDir, "http://localhost:8080")
	if err != nil {
		t.Fatalf("NewLocalProvider failed: %v", err)
	}

	ctx := context.Background()
	testKey := "test/catalog/can.txt"
	testContent := "Metal Packaging Spec - Lohakit"

	// Upload
	err = provider.Upload(ctx, testKey, bytes.NewReader([]byte(testContent)), int64(len(testContent)), "text/plain")
	if err != nil {
		t.Fatalf("Upload failed: %v", err)
	}

	// Metadata
	meta, err := provider.GetMetadata(ctx, testKey)
	if err != nil {
		t.Fatalf("GetMetadata failed: %v", err)
	}
	if meta.Size != int64(len(testContent)) {
		t.Errorf("Expected size %d, got %d", len(testContent), meta.Size)
	}

	// Download
	rc, err := provider.Download(ctx, testKey)
	if err != nil {
		t.Fatalf("Download failed: %v", err)
	}
	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(rc)
	rc.Close()
	if err != nil {
		t.Fatalf("ReadFrom failed: %v", err)
	}
	if buf.String() != testContent {
		t.Errorf("Expected content %q, got %q", testContent, buf.String())
	}

	// Copy
	copyKey := "test/catalog/can_copy.txt"
	err = provider.Copy(ctx, testKey, copyKey)
	if err != nil {
		t.Fatalf("Copy failed: %v", err)
	}

	// Delete
	err = provider.Delete(ctx, testKey)
	if err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	_, err = provider.GetMetadata(ctx, testKey)
	if err == nil {
		t.Error("Expected error getting metadata for deleted file, got nil")
	}
}
