package dtos

import "github.com/google/uuid"

type GetOperationsDto struct {
	DocumentId uuid.UUID
	ClientId   *uuid.UUID
	Counter    *int
}
