package admin

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/middleware"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
)

type ProductHandler struct {
	productSvc *service.ProductService
	auditSvc   *service.AuditService
}

func NewProductHandler(ps *service.ProductService, aud *service.AuditService) *ProductHandler {
	return &ProductHandler{
		productSvc: ps,
		auditSvc:   aud,
	}
}

type CreateProductRequest struct {
	CategoryID      uuid.UUID                   `json:"categoryId"`
	SKU             string                      `json:"sku"`
	Status          domain.ContentStatus        `json:"status"`
	Specifications  json.RawMessage             `json:"specifications"`
	SortOrder       int                         `json:"sortOrder"`
	FeaturedImageID *uuid.UUID                  `json:"featuredImageId"`
	Translations    []domain.ProductTranslation `json:"translations"`
	ImageIDs        []uuid.UUID                 `json:"imageIds"`
}

type CreateCategoryRequest struct {
	Slug         string                            `json:"slug"`
	SortOrder    int                               `json:"sortOrder"`
	Translations []domain.ProductCategoryTranslation `json:"translations"`
}

func (h *ProductHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	status := r.URL.Query().Get("status")

	var categoryID *uuid.UUID
	catParam := r.URL.Query().Get("categoryId")
	if catParam != "" {
		if u, err := uuid.Parse(catParam); err == nil {
			categoryID = &u
		}
	}

	products, total, err := h.productSvc.ListProducts(r.Context(), categoryID, status, p.Search, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Paginated(w, r, products, p.Page, p.PageSize, total)
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid product ID", nil))
		return
	}

	product, err := h.productSvc.GetProductByID(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, product)
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid product payload", nil))
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid uuid.UUID
	if user != nil {
		uid = user.ID
	}

	product, err := h.productSvc.CreateProduct(r.Context(), service.CreateProductParams{
		CategoryID:      req.CategoryID,
		SKU:             req.SKU,
		Status:          req.Status,
		Specifications:  req.Specifications,
		SortOrder:       req.SortOrder,
		FeaturedImageID: req.FeaturedImageID,
		CreatedBy:       uid,
		Translations:    req.Translations,
		ImageIDs:        req.ImageIDs,
	})
	if err != nil {
		response.Error(w, r, err)
		return
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     &uid,
		Action:     "CREATE",
		Resource:   "product",
		ResourceID: product.ID.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
		NewValues:  product,
	})

	response.Created(w, r, product)
}

func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid product ID", nil))
		return
	}

	err = h.productSvc.SoftDeleteProduct(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	user := middleware.GetUserFromContext(r.Context())
	var uid *uuid.UUID
	if user != nil {
		uid = &user.ID
	}

	h.auditSvc.Log(r.Context(), service.RecordAuditParams{
		UserID:     uid,
		Action:     "DELETE",
		Resource:   "product",
		ResourceID: id.String(),
		IPAddress:  middleware.GetClientIP(r),
		UserAgent:  r.UserAgent(),
	})

	response.OK(w, r, map[string]string{"message": "Product moved to trash"})
}

func (h *ProductHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	cats, err := h.productSvc.ListCategories(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.OK(w, r, cats)
}

func (h *ProductHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var req CreateCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, domain.NewValidationError("Invalid category payload", nil))
		return
	}

	cat, err := h.productSvc.CreateCategory(r.Context(), req.Slug, req.SortOrder, req.Translations)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.Created(w, r, cat)
}
