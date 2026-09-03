package public

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/transport/http/response"
	"github.com/lohakit/cms-backend/pkg/utils"
)

type PublicProductHandler struct {
	productSvc *service.ProductService
}

func NewPublicProductHandler(ps *service.ProductService) *PublicProductHandler {
	return &PublicProductHandler{productSvc: ps}
}

// ListProducts lists published packaging products
func (h *PublicProductHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	p := response.ParsePagination(r)
	targetLang := utils.NormalizeLanguage(r.URL.Query().Get("lang"))

	var categoryID *uuid.UUID
	catParam := r.URL.Query().Get("categoryId")
	if catParam != "" {
		if u, err := uuid.Parse(catParam); err == nil {
			categoryID = &u
		}
	}

	products, total, err := h.productSvc.ListProducts(r.Context(), categoryID, "PUBLISHED", p.Search, p.PageSize, p.CalculateOffset())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	// Localize list items
	localizedList := make([]map[string]any, len(products))
	for i, prod := range products {
		fullProd, _ := h.productSvc.GetProductByID(r.Context(), prod.ID)
		name := prod.SKU
		slug := prod.SKU
		desc := ""

		if fullProd != nil {
			fallbackOrder := utils.GetFallbackOrder(targetLang)
			for _, lang := range fallbackOrder {
				if t, ok := fullProd.Translations[lang]; ok && t.Name != "" {
					name = t.Name
					slug = t.Slug
					desc = t.Description
					break
				}
			}
		}

		localizedList[i] = map[string]any{
			"id":               prod.ID,
			"categoryId":       prod.CategoryID,
			"categorySlug":     prod.CategorySlug,
			"sku":              prod.SKU,
			"name":             name,
			"slug":             slug,
			"description":      desc,
			"featuredImageUrl": prod.FeaturedImageURL,
			"specifications":   prod.Specifications,
		}
	}

	response.Paginated(w, r, localizedList, p.Page, p.PageSize, total)
}

// GetProduct retrieves a single product by slug and language
func (h *PublicProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	targetLang := r.URL.Query().Get("lang")

	prod, err := h.productSvc.GetLocalizedProduct(r.Context(), slug, targetLang)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.OK(w, r, prod)
}

// ListCategories lists all product categories with localized names
func (h *PublicProductHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	targetLang := utils.NormalizeLanguage(r.URL.Query().Get("lang"))
	cats, err := h.productSvc.ListCategories(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}

	fallbackOrder := utils.GetFallbackOrder(targetLang)
	localizedCats := make([]map[string]any, len(cats))
	for i, c := range cats {
		name := c.Slug
		desc := ""

		for _, lang := range fallbackOrder {
			if t, ok := c.Translations[lang]; ok && t.Name != "" {
				name = t.Name
				desc = t.Description
				break
			}
		}

		localizedCats[i] = map[string]any{
			"id":          c.ID,
			"slug":        c.Slug,
			"name":        name,
			"description": desc,
			"sortOrder":   c.SortOrder,
		}
	}

	response.OK(w, r, localizedCats)
}
