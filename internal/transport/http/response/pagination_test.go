package response

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestParsePagination(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/pages?page=2&pageSize=50&sort=title&order=ASC&search=packaging", nil)
	p := ParsePagination(req)

	if p.Page != 2 {
		t.Errorf("Expected page 2, got %d", p.Page)
	}
	if p.PageSize != 50 {
		t.Errorf("Expected pageSize 50, got %d", p.PageSize)
	}
	if p.Sort != "title" {
		t.Errorf("Expected sort 'title', got %s", p.Sort)
	}
	if p.Order != "asc" {
		t.Errorf("Expected order 'asc', got %s", p.Order)
	}
	if p.Search != "packaging" {
		t.Errorf("Expected search 'packaging', got %s", p.Search)
	}
	if p.CalculateOffset() != 50 {
		t.Errorf("Expected offset 50, got %d", p.CalculateOffset())
	}
}

func TestParsePaginationDefaults(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/pages?page=-1&pageSize=999", nil)
	p := ParsePagination(req)

	if p.Page != 1 {
		t.Errorf("Expected page fallback to 1, got %d", p.Page)
	}
	if p.PageSize != 20 {
		t.Errorf("Expected pageSize fallback to 20, got %d", p.PageSize)
	}
	if p.Order != "desc" {
		t.Errorf("Expected order fallback to 'desc', got %s", p.Order)
	}
}

func TestNewPaginationMetadata(t *testing.T) {
	meta := NewPaginationMetadata(1, 20, 95)
	if meta.Pagination.TotalPages != 5 {
		t.Errorf("Expected 5 totalPages for 95 items with pageSize 20, got %d", meta.Pagination.TotalPages)
	}
}
