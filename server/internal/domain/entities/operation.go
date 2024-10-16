package entities

import (
	"github.com/ananiyat/edit-wars/server/internal/domain/types"

	"github.com/google/uuid"
)

type OperationType string

const (
	OperationTypeInsert OperationType = "INSERT"
	OperationTypeDelete OperationType = "DELETE"
)

type Operation struct {
	Type       OperationType  `json:"type"`
	DocumentId uuid.UUID      `json:"documentId"`
	ChrId      uuid.UUID      `json:"chrId"`
	Value      rune           `json:"value"`
	ClientId   uuid.UUID      `json:"clientId"`
	Position   types.Position `json:"position"`
	Counter    int            `json:"counter"`
}

func NewOperation(
	chrId, clientId, documentId uuid.UUID,
	value rune, position types.Position,
	operationType OperationType, counter int) Operation {
	return Operation{
		Type:     operationType,
		ChrId:    chrId,
		Value:    value,
		ClientId: clientId,
		Position: position,
		Counter:  counter,
	}
}
