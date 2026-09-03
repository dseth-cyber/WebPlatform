package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lohakit/cms-backend/internal/config"
	"github.com/lohakit/cms-backend/internal/repository"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/internal/storage"
	appHTTP "github.com/lohakit/cms-backend/internal/transport/http"
	"github.com/lohakit/cms-backend/internal/transport/http/handler"
	"github.com/lohakit/cms-backend/internal/transport/http/handler/admin"
	"github.com/lohakit/cms-backend/internal/transport/http/handler/public"
	"github.com/lohakit/cms-backend/pkg/logger"
)

func main() {
	// 1. Config & Structured Logger
	cfg := config.Load()

	logLevel := slog.LevelInfo
	if !cfg.IsProduction() {
		logLevel = slog.LevelDebug
	}
	log := logger.New(os.Stdout, logLevel)

	log.Info("Starting Lohakit Rungchareonsap CMS Backend",
		slog.String("env", cfg.AppEnv),
		slog.Int("port", cfg.Port),
		slog.String("storage_driver", cfg.StorageDriver),
	)

	// 2. Database Connection Pool (pgxpool)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	poolConfig, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		log.Error("Failed to parse database configuration", slog.Any("error", err))
		os.Exit(1)
	}
	poolConfig.MaxConns = 25
	poolConfig.MinConns = 5
	poolConfig.MaxConnLifetime = 1 * time.Hour
	poolConfig.MaxConnIdleTime = 30 * time.Minute

	dbPool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		log.Error("Failed to create database connection pool", slog.Any("error", err))
		os.Exit(1)
	}
	defer dbPool.Close()

	if err := dbPool.Ping(ctx); err != nil {
		log.Warn("Database ping check warning at startup (database might still be starting)", slog.Any("error", err))
	} else {
		log.Info("Successfully connected to PostgreSQL database")
		if err := repository.AutoMigrate(ctx, dbPool, log); err != nil {
			log.Error("Failed to apply auto migrations", slog.Any("error", err))
		}
	}

	// 3. Storage Provider (MinIO / Local)
	storeProvider, err := storage.GetStorageProvider(cfg)
	if err != nil {
		log.Error("Failed to initialize storage provider", slog.Any("error", err))
		os.Exit(1)
	}

	// 4. SQL Queries & Services
	queries := sqlc.New(dbPool)

	auditSvc := service.NewAuditService(queries)
	authSvc := service.NewAuthService(queries, cfg)
	rbacSvc := service.NewRBACService(queries)
	mediaSvc := service.NewMediaService(queries, storeProvider, cfg)
	pageSvc := service.NewPageService(queries)
	productSvc := service.NewProductService(queries, storeProvider)
	newsSvc := service.NewNewsService(queries, storeProvider)
	settingsSvc := service.NewSettingsService(queries)
	contactSvc := service.NewContactService(queries)
	trashSvc := service.NewTrashService(queries, storeProvider)

	// 5. HTTP Handlers
	healthHdlr := handler.NewHealthHandler(dbPool)

	pubPages := public.NewPublicPageHandler(pageSvc)
	pubProducts := public.NewPublicProductHandler(productSvc)
	pubNews := public.NewPublicNewsHandler(newsSvc)
	pubSettings := public.NewPublicSettingsHandler(settingsSvc)
	pubContact := public.NewPublicContactHandler(contactSvc)

	admAuth := admin.NewAuthHandler(authSvc, auditSvc, cfg)
	admUsers := admin.NewUserHandler(rbacSvc, auditSvc)
	admPages := admin.NewPageHandler(pageSvc, auditSvc)
	admMedia := admin.NewMediaHandler(mediaSvc, auditSvc)
	admProducts := admin.NewProductHandler(productSvc, auditSvc)
	admNews := admin.NewNewsHandler(newsSvc, auditSvc)
	admSettings := admin.NewSettingsHandler(settingsSvc, auditSvc)
	admAudit := admin.NewAuditHandler(auditSvc)
	admTrash := admin.NewTrashHandler(trashSvc, auditSvc)

	// 6. Router Assembly
	router := appHTTP.NewRouter(appHTTP.RouterParams{
		Config:         cfg,
		Logger:         log,
		SessionStore:   authSvc,
		HealthHandler:  healthHdlr,
		PublicPages:    pubPages,
		PublicProducts: pubProducts,
		PublicNews:     pubNews,
		PublicSettings: pubSettings,
		PublicContact:  pubContact,
		AdminAuth:      admAuth,
		AdminUsers:     admUsers,
		AdminPages:     admPages,
		AdminMedia:     admMedia,
		AdminProducts:  admProducts,
		AdminNews:      admNews,
		AdminSettings:  admSettings,
		AdminAudit:     admAudit,
		AdminTrash:     admTrash,
	})

	// 7. HTTP Server & Graceful Shutdown
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	serverErrors := make(chan error, 1)
	go func() {
		log.Info("HTTP Server listening", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErrors <- err
		}
	}()

	// 8. Wait for OS Termination Signal
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		log.Error("Server error occurred", slog.Any("error", err))
	case sig := <-shutdown:
		log.Info("Shutdown signal received", slog.String("signal", sig.String()))

		shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancelShutdown()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Error("Graceful shutdown failed, forcing close", slog.Any("error", err))
			_ = srv.Close()
		}
		log.Info("Server stopped cleanly")
	}
}
