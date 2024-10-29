package dtos

import (
	"github.com/ananiyat/edit-wars/server/internal/domain/entities"
	"github.com/google/uuid"
)

type GetOperationsDto struct {
	DocumentId uuid.UUID
	ClientId   *uuid.UUID
	Counter    *int
	Type       *entities.OperationType
}
