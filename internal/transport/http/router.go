package http

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/lohakit/cms-backend/internal/config"
	"github.com/lohakit/cms-backend/internal/transport/http/handler"
	"github.com/lohakit/cms-backend/internal/transport/http/handler/admin"
	"github.com/lohakit/cms-backend/internal/transport/http/handler/public"
	appMiddleware "github.com/lohakit/cms-backend/internal/transport/http/middleware"
)

type RouterParams struct {
	Config          *config.Config
	Logger          *slog.Logger
	SessionStore    appMiddleware.SessionStore
	HealthHandler   *handler.HealthHandler
	PublicPages     *public.PublicPageHandler
	PublicProducts  *public.PublicProductHandler
	PublicNews      *public.PublicNewsHandler
	PublicSettings  *public.PublicSettingsHandler
	PublicContact   *public.PublicContactHandler
	AdminAuth       *admin.AuthHandler
	AdminUsers      *admin.UserHandler
	AdminPages      *admin.PageHandler
	AdminMedia      *admin.MediaHandler
	AdminProducts   *admin.ProductHandler
	AdminNews       *admin.NewsHandler
	AdminSettings   *admin.SettingsHandler
	AdminAudit      *admin.AuditHandler
	AdminTrash      *admin.TrashHandler
}

// NewRouter builds and configures the Chi HTTP router
func NewRouter(p RouterParams) *chi.Mux {
	r := chi.NewRouter()

	// 1. Core Global Middlewares
	r.Use(appMiddleware.RequestID)
	r.Use(appMiddleware.SecurityHeaders(p.Config))
	r.Use(appMiddleware.StructuredLogger(p.Logger))
	r.Use(appMiddleware.Recovery(p.Logger))
	r.Use(chiMiddleware.RealIP)
	r.Use(chiMiddleware.Compress(5))

	// 2. CORS Configuration
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   p.Config.CORSAllowed,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Request-ID"},
		ExposedHeaders:   []string{"Link", "X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// 3. Global Rate Limiting (50 RPS per IP, burst 100)
	globalLimiter := appMiddleware.NewIPRateLimiter(50, 100, 10*time.Minute)
	r.Use(appMiddleware.RateLimit(globalLimiter))

	// 4. Probes
	r.Get("/healthz", p.HealthHandler.Liveness)
	r.Get("/readyz", p.HealthHandler.Readiness)

	// 5. Local Storage Static File Serving (for dev/local driver)
	if p.Config.StorageDriver == "local" {
		r.Handle("/storage/*", http.StripPrefix("/storage/", http.FileServer(http.Dir(p.Config.StorageBaseDir))))
	}

	// 6. Public REST API
	r.Route("/api/v1/public", func(pub chi.Router) {
		// Public Pages & Page Builder sections
		pub.Get("/pages/{slug}", p.PublicPages.GetPage)
		pub.Get("/pages", p.PublicPages.GetPage) // default to home

		// Public Product Catalog
		pub.Get("/products", p.PublicProducts.ListProducts)
		pub.Get("/products/{slug}", p.PublicProducts.GetProduct)
		pub.Get("/categories", p.PublicProducts.ListCategories)

		// Public News
		pub.Get("/news", p.PublicNews.ListNews)
		pub.Get("/news/{slug}", p.PublicNews.GetNews)

		// Public Settings & Themes
		pub.Get("/settings", p.PublicSettings.GetPublicSettings)
		pub.Put("/settings", p.AdminSettings.UpsertSetting)
		pub.Get("/theme", p.PublicSettings.GetActiveTheme)

		// Public Contact Form (with stricter rate limiter: 5 submissions/min)
		contactLimiter := appMiddleware.NewIPRateLimiter(0.1, 5, 5*time.Minute)
		pub.With(appMiddleware.RateLimit(contactLimiter)).Post("/contact", p.PublicContact.SubmitInquiry)
	})

	// 7. Admin Authentication (Public Login / Session)
	r.Route("/api/v1/admin/auth", func(auth chi.Router) {
		// Login rate limiting (5 attempts/min to prevent brute-force)
		loginLimiter := appMiddleware.NewIPRateLimiter(0.2, 5, 15*time.Minute)
		auth.With(appMiddleware.RateLimit(loginLimiter)).Post("/login", p.AdminAuth.Login)
		auth.With(appMiddleware.Authenticate(p.SessionStore)).Post("/logout", p.AdminAuth.Logout)
		auth.With(appMiddleware.Authenticate(p.SessionStore)).Get("/me", p.AdminAuth.Me)
		auth.With(appMiddleware.Authenticate(p.SessionStore)).Post("/reauth", p.AdminAuth.ReAuth)
	})

	// 8. Protected Admin CMS APIs
	r.Route("/api/v1/admin", func(adm chi.Router) {
		// Must be authenticated with valid session
		adm.Use(appMiddleware.Authenticate(p.SessionStore))
		adm.Use(appMiddleware.RequireAuth)
		adm.Use(appMiddleware.CSRF())

		// Users & RBAC
		adm.Route("/users", func(u chi.Router) {
			u.With(appMiddleware.RequirePermission("users.read")).Get("/", p.AdminUsers.ListUsers)
			u.With(appMiddleware.RequirePermission("users.create")).Post("/", p.AdminUsers.CreateUser)
			u.With(appMiddleware.RequirePermission("users.update")).Put("/{id}", p.AdminUsers.UpdateUser)
			u.With(appMiddleware.RequirePermission("users.delete")).Delete("/{id}", p.AdminUsers.DeleteUser)
		})
		adm.With(appMiddleware.RequirePermission("users.read")).Get("/roles", p.AdminUsers.ListRoles)
		adm.With(appMiddleware.RequirePermission("users.read")).Get("/permissions", p.AdminUsers.ListPermissions)

		// Pages & Page Builder
		adm.Route("/pages", func(pg chi.Router) {
			pg.With(appMiddleware.RequirePermission("page.read")).Get("/", p.AdminPages.ListPages)
			pg.With(appMiddleware.RequirePermission("page.read")).Get("/{id}", p.AdminPages.GetPage)
			pg.With(appMiddleware.RequirePermission("page.create")).Post("/", p.AdminPages.CreatePage)
			pg.With(appMiddleware.RequirePermission("page.delete")).Delete("/{id}", p.AdminPages.DeletePage)
			pg.With(appMiddleware.RequirePermission("page.publish")).Post("/{id}/publish", p.AdminPages.PublishPage)
			pg.With(appMiddleware.RequirePermission("page.publish")).Post("/{id}/unpublish", p.AdminPages.UnpublishPage)
			pg.With(appMiddleware.RequirePermission("page.read")).Get("/{id}/revisions", p.AdminPages.ListRevisions)

			// Section Builder
			pg.With(appMiddleware.RequirePermission("page.update")).Post("/{id}/sections", p.AdminPages.AddSection)
			pg.With(appMiddleware.RequirePermission("page.update")).Put("/{id}/sections/reorder", p.AdminPages.ReorderSections)
			pg.With(appMiddleware.RequirePermission("page.update")).Delete("/{id}/sections/{sectionId}", p.AdminPages.DeleteSection)
		})

		// Media Library
		adm.Route("/media", func(m chi.Router) {
			m.With(appMiddleware.RequirePermission("media.read")).Get("/", p.AdminMedia.ListMedia)
			m.With(appMiddleware.RequirePermission("media.upload")).Post("/", p.AdminMedia.Upload)
			m.With(appMiddleware.RequirePermission("media.update")).Put("/{id}/replace", p.AdminMedia.Replace)
			m.With(appMiddleware.RequirePermission("media.delete")).Delete("/{id}", p.AdminMedia.DeleteMedia)
		})

		// Product Catalog
		adm.Route("/products", func(pr chi.Router) {
			pr.With(appMiddleware.RequirePermission("product.read")).Get("/", p.AdminProducts.ListProducts)
			pr.With(appMiddleware.RequirePermission("product.read")).Get("/{id}", p.AdminProducts.GetProduct)
			pr.With(appMiddleware.RequirePermission("product.create")).Post("/", p.AdminProducts.CreateProduct)
			pr.With(appMiddleware.RequirePermission("product.delete")).Delete("/{id}", p.AdminProducts.DeleteProduct)
		})
		adm.With(appMiddleware.RequirePermission("product.read")).Get("/product-categories", p.AdminProducts.ListCategories)
		adm.With(appMiddleware.RequirePermission("product.create")).Post("/product-categories", p.AdminProducts.CreateCategory)

		// News
		adm.Route("/news", func(nw chi.Router) {
			nw.With(appMiddleware.RequirePermission("news.read")).Get("/", p.AdminNews.ListArticles)
			nw.With(appMiddleware.RequirePermission("news.read")).Get("/{id}", p.AdminNews.GetArticle)
			nw.With(appMiddleware.RequirePermission("news.create")).Post("/", p.AdminNews.CreateArticle)
			nw.With(appMiddleware.RequirePermission("news.delete")).Delete("/{id}", p.AdminNews.DeleteArticle)
		})

		// Settings & Themes
		adm.Route("/settings", func(st chi.Router) {
			st.With(appMiddleware.RequirePermission("settings.read")).Get("/", p.AdminSettings.ListSettings)
			st.With(appMiddleware.RequirePermission("settings.update")).Put("/", p.AdminSettings.UpsertSetting)
		})
		adm.Route("/themes", func(th chi.Router) {
			th.With(appMiddleware.RequirePermission("settings.read")).Get("/", p.AdminSettings.ListThemes)
			th.With(appMiddleware.RequirePermission("settings.update")).Put("/active", p.AdminSettings.SetActiveTheme)
		})

		// Audit Logs (Read-only for admins)
		adm.With(appMiddleware.RequirePermission("audit.read")).Get("/audit-logs", p.AdminAudit.ListAuditLogs)

		// Trash Management & Destructive Operations
		adm.Route("/trash", func(tr chi.Router) {
			tr.With(appMiddleware.RequirePermission("trash.restore")).Post("/{entityType}/{id}/restore", p.AdminTrash.Restore)

			// Permanent delete and empty trash strictly require recent password re-authentication (5 min window)
			tr.With(appMiddleware.RequirePermission("trash.permanent_delete"), appMiddleware.RequireReAuth(5*time.Minute)).
				Post("/{entityType}/{id}/permanent", p.AdminTrash.PermanentDelete)

			tr.With(appMiddleware.RequirePermission("trash.permanent_delete"), appMiddleware.RequireReAuth(5*time.Minute)).
				Post("/empty", p.AdminTrash.EmptyTrash)
		})
	})

	return r
}
