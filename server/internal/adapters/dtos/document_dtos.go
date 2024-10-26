package dtos

import (
	"github.com/ananiyat/edit-wars/server/internal/domain/entities"
)

type NewDocumentRequestDTO struct {
	Title string `json:"title"`
}

type GetDocumentResponseDTO struct {
	Document   entities.Document    `json:"document"`
	Characters []entities.Character `json:"characters"`
}
