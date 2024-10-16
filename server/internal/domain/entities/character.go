package entities

import (
	"github.com/ananiyat/edit-wars/server/internal/domain/types"

	"github.com/google/uuid"
)

type Character struct {
	Id         uuid.UUID      `json:"id" bun:",pk"`
	DocumentId uuid.UUID      `json:"documentId"`
	Position   types.Position `json:"position"`
	Value      rune           `json:"value"`
}

func NewCharacter(id, documentId uuid.UUID, position types.Position, value rune) Character {
	return Character{
		Id:         id,
		DocumentId: documentId,
		Position:   position,
		Value:      value,
	}
}