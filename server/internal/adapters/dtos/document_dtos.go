package dtos

import (
	"github.com/ananiyat/edit-wars/server/internal/domain/entities"

	"github.com/google/uuid"
)

type NewDocumentRequestDTO struct {
	Title   string    `json:"title"`
	OwnerId uuid.UUID `json:"ownerId"`
}

type GetDocumentResponseDTO struct {
	Document   entities.Document    `json:"document"`
	Characters []entities.Character `json:"characters"`
}
