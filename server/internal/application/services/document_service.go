package services

import (
	"github.com/ananiyat/edit-wars/server/internal/domain"
	"github.com/ananiyat/edit-wars/server/internal/domain/entities"

	"github.com/google/uuid"
)

type DocumentService struct {
	documentRepository  domain.DocumentRepository
	characterRepository domain.CharacterRepository
}

func NewDocumentService(
	documentRepository domain.DocumentRepository,
	characterRepository domain.CharacterRepository) *DocumentService {
	return &DocumentService{
		documentRepository:  documentRepository,
		characterRepository: characterRepository,
	}
}

func (d *DocumentService) CreateDocument(title string, ownerId uuid.UUID) (entities.Document, error) {
	document := entities.NewDocument(uuid.New(), ownerId, title)
	err := d.documentRepository.Save(document)
	if err != nil {
		return entities.Document{}, err
	}
	return document, nil
}

func (d *DocumentService) GetDocumentById(id uuid.UUID) (entities.Document, error) {
	return d.documentRepository.Find(id)
}

func (d *DocumentService) GetDocumentsByUserId(userId uuid.UUID) ([]entities.Document, error) {
	return d.documentRepository.FindByUserId(userId)
}

func (d *DocumentService) GetCharacters(documentId uuid.UUID) ([]entities.Character, error) {
	return d.characterRepository.FindByDocumentId(documentId)
}

func (d *DocumentService) Exists(id uuid.UUID) (bool, error) {
	return d.documentRepository.Exists(id)
}
