package repositories

import (
	"github.com/ananiyat/edit-wars/server/internal/domain/entities"
	"github.com/ananiyat/edit-wars/server/internal/infrastructure/database"

	"github.com/google/uuid"
)

type PgOperationRepository struct {
	db database.Database[entities.Operation]
}

func NewPgOperationRepository(db database.Database[entities.Operation]) *PgOperationRepository {
	return &PgOperationRepository{db: db}
}

func (o *PgOperationRepository) FindOne(clientId uuid.UUID, counter int) (entities.Operation, error) {
	return o.db.FindOne("client_id = ?, counter = ?", clientId, counter)
}

func (o *PgOperationRepository) FindByClientId(clientId uuid.UUID) ([]entities.Operation, error) {
	return o.db.Find("client_id = ?", clientId)
}

func (o *PgOperationRepository) FindByDocumentId(documentId uuid.UUID) ([]entities.Operation, error) {
	return o.db.Find("document_id = ?", documentId)
}

// Returns all operations of a client with a counter greater than or equal to the given counter.
func (o *PgOperationRepository) FindGeqCounter(clientId uuid.UUID, counter int) ([]entities.Operation, error) {
	return o.db.Find("client_id = ?, counter >= ?", clientId, counter)
}

func (o *PgOperationRepository) FindAll() ([]entities.Operation, error) {
	return o.db.FindAll()
}

func (o *PgOperationRepository) Save(operation entities.Operation) error {
	return o.db.Save(operation)
}

func (o *PgOperationRepository) SaveMany(operations []entities.Operation) error {
	return o.db.SaveMany(operations)
}

func (o *PgOperationRepository) Delete(operation entities.Operation) error {
	return o.db.Delete(operation)
}

func (o *PgOperationRepository) DeleteMany(operations []entities.Operation) error {
	return o.db.DeleteMany(operations)
}

func (o *PgOperationRepository) Exists(id uuid.UUID) (bool, error) {
	return o.db.Exists(id)
}
