package response

import (
	"math"
	"net/http"
	"strconv"
	"strings"
)

type PaginationParams struct {
	Page     int    `json:"page"`
	PageSize int    `json:"pageSize"`
	Sort     string `json:"sort"`
	Order    string `json:"order"` // "asc" or "desc"
	Search   string `json:"search"`
}

type PaginationMetadata struct {
	Pagination PaginationInfo `json:"pagination"`
}

type PaginationInfo struct {
	Page       int   `json:"page"`
	PageSize   int   `json:"pageSize"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"totalPages"`
}

// ParsePagination extracts and sanitizes pagination query parameters
func ParsePagination(r *http.Request) PaginationParams {
	q := r.URL.Query()

	page, _ := strconv.Atoi(q.Get("page"))
	if page < 1 {
		page = 1
	}

	pageSize, _ := strconv.Atoi(q.Get("pageSize"))
	switch pageSize {
	case 10, 20, 50, 100:
		// valid
	default:
		pageSize = 20 // default page size
	}

	sort := strings.TrimSpace(q.Get("sort"))
	if sort == "" {
		sort = "created_at"
	}

	order := strings.ToLower(strings.TrimSpace(q.Get("order")))
	if order != "asc" && order != "desc" {
		order = "desc"
	}

	search := strings.TrimSpace(q.Get("search"))

	return PaginationParams{
		Page:     page,
		PageSize: pageSize,
		Sort:     sort,
		Order:    order,
		Search:   search,
	}
}

// CalculateOffset returns the SQL offset
func (p PaginationParams) CalculateOffset() int {
	return (p.Page - 1) * p.PageSize
}

// NewPaginationMetadata calculates totalPages and builds metadata object
func NewPaginationMetadata(page, pageSize int, total int64) PaginationMetadata {
	totalPages := 0
	if pageSize > 0 && total > 0 {
		totalPages = int(math.Ceil(float64(total) / float64(pageSize)))
	}

	return PaginationMetadata{
		Pagination: PaginationInfo{
			Page:       page,
			PageSize:   pageSize,
			Total:      total,
			TotalPages: totalPages,
		},
	}
}

// Paginated responds with status 200 OK, wrapped in data and pagination metadata
func Paginated(w http.ResponseWriter, r *http.Request, data any, page, pageSize int, total int64) {
	meta := NewPaginationMetadata(page, pageSize, total)
	JSON(w, r, http.StatusOK, data, meta)
}
