package server

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/ananiyat/edit-wars/server/internal/adapters/controllers"
	"github.com/ananiyat/edit-wars/server/internal/application/repositories"
	"github.com/ananiyat/edit-wars/server/internal/application/services"
	"github.com/ananiyat/edit-wars/server/internal/domain/entities"
	"github.com/ananiyat/edit-wars/server/internal/infrastructure/database"
	"github.com/ananiyat/edit-wars/server/internal/infrastructure/websocket"
	"github.com/ananiyat/edit-wars/server/internal/server/middlewares"

	"github.com/gorilla/mux"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

type Server struct {
	Port        string
	Router      *mux.Router
	Hub         *websocket.Hub
	Controllers []controllers.Controller
}

func NewServer(config Config) Server {
	services := NewServices(config)
	wsHub := websocket.NewHub()

	// http
	documentController := controllers.NewDocumentController(services.DocumentService)

	// websocket
	wsAdapter := controllers.NewWebsocketAdapter(wsHub, services.DocumentService)
	operationAdapter := controllers.NewOperationAdapter(wsHub, services.OperationsService)

	controllers_ := []controllers.Controller{
		documentController,
		wsAdapter,
		operationAdapter,
	}

	return Server{Port: config.Port, Router: mux.NewRouter(), Controllers: controllers_, Hub: wsHub}
}

func (s *Server) RegisterRoutes() {
	for _, controller := range s.Controllers {
		controller.RegisterRoutes(s.Router)
	}
}

func (s *Server) RegisterMiddlewares() {
	s.Router.Use(middlewares.LoggingMiddleware)
}

func (s *Server) Start() {
	fmt.Printf("Server running on port %v\n", s.Port)
	go s.Hub.Run()
	err := http.ListenAndServe(
		fmt.Sprintf("0.0.0.0:%v", s.Port),
		middlewares.RemoveTrailingSlashMiddleware(s.Router),
	)
	if err != nil {
		panic(err)
	}
}

type Config struct {
	Port string
	DB   *bun.DB
}

func NewConfig(port, dsn string) Config {
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))
	db := bun.NewDB(sqldb, pgdialect.New())
	db.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	return Config{
		Port: port,
		DB:   db,
	}
}

type Services struct {
	DocumentService   *services.DocumentService
	OperationsService *services.OperationService
}

func NewServices(config Config) Services {
	documentDb := database.NewPostgresDB[entities.Document](config.DB)
	characterDb := database.NewPostgresDB[entities.Character](config.DB)
	operationDb := database.NewPostgresDB[entities.Operation](config.DB)

	characterRepo := repositories.NewPgCharacterRepository(characterDb)
	operationRepo := repositories.NewPgOperationRepository(operationDb)
	documentRepo := repositories.NewPgDocumentRepository(documentDb)

	documentService := services.NewDocumentService(documentRepo, characterRepo)
	operationsService := services.NewOperationService(operationRepo, characterRepo)

	return Services{
		DocumentService:   documentService,
		OperationsService: operationsService,
	}
}
