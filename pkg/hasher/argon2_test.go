package hasher

import (
	"testing"
)

func TestArgon2HashAndVerify(t *testing.T) {
	password := "SecureCorporateP@ssw0rd2026!"

	hash, err := GenerateHash(password, nil)
	if err != nil {
		t.Fatalf("GenerateHash failed: %v", err)
	}

	if hash == "" {
		t.Fatal("GenerateHash returned empty string")
	}

	// Verify correct password
	match, err := ComparePasswordAndHash(password, hash)
	if err != nil {
		t.Fatalf("ComparePasswordAndHash returned error: %v", err)
	}
	if !match {
		t.Fatal("Expected password to match hash, but it did not")
	}

	// Verify wrong password
	match, err = ComparePasswordAndHash("WrongPassword!", hash)
	if err != nil {
		t.Fatalf("ComparePasswordAndHash returned error for wrong password: %v", err)
	}
	if match {
		t.Fatal("Expected wrong password to fail verification, but it matched")
	}
}

func TestArgon2InvalidFormat(t *testing.T) {
	_, err := ComparePasswordAndHash("test", "invalid_hash_string")
	if err == nil {
		t.Fatal("Expected error for invalid hash string format, got nil")
	}
}
