package migrations

import (
	"context"
	"database/sql"
	"embed"
	"fmt"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"github.com/uptrace/bun/migrate"
)

//go:embed *.sql
var migrationFiles embed.FS

func Migrate(dsn string) {
	if dsn == "" {
		panic("DSN required")
	}

	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))
	db := bun.NewDB(sqldb, pgdialect.New())
	db.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	runMigrations(db, context.Background())
}

func runMigrations(db *bun.DB, ctx context.Context) error {
	migrations := migrate.NewMigrations()
	fmt.Println(migrations)
	if err := migrations.Discover(migrationFiles); err != nil {
		return err
	}
	fmt.Println(migrations)
	migrator := migrate.NewMigrator(db, migrations)
	migrator.Init(ctx)
	migrator.Migrate(ctx)

	return nil
}
