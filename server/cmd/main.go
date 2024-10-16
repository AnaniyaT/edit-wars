package main

import (
	"flag"
	"fmt"
	"github.com/ananiyat/edit-wars/server/cmd/migrations"
	"os"

	"github.com/ananiyat/edit-wars/server/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	defaultDsn := os.Getenv("DATABASE_URL")
	port := flag.String("port", "8080", "Port to run the server on")
	dsn := flag.String("dsn", defaultDsn, "Data source name for the database")

	var migrate bool
	flag.BoolVar(&migrate, "migrate", false, "migrate the database to the latest version")

	flag.Parse()

	if migrate == true {
		migrations.Migrate()
		fmt.Println("migrated successfully... exiting...")
		return
	}

	if *dsn == "" {
		panic("DSN is required")
	}

	config := server.NewConfig(*port, *dsn)
	server := server.NewServer(config)

	server.RegisterMiddlewares()
	server.RegisterRoutes()
	server.Start()
}
