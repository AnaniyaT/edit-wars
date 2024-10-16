package controllers

import (
	"net/http"

	"github.com/ananiyat/edit-wars/server/internal/adapters"
	"github.com/ananiyat/edit-wars/server/internal/adapters/dtos"
	"github.com/ananiyat/edit-wars/server/internal/application/services"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type DocumentController struct {
	documentService *services.DocumentService
}

func NewDocumentController(documentService *services.DocumentService) *DocumentController {
	return &DocumentController{documentService: documentService}
}

func (dc *DocumentController) RegisterRoutes(router *mux.Router) {
	subRoute := router.PathPrefix("/documents").Subrouter()
	subRoute.HandleFunc("", dc.handleNewDocument).Methods(http.MethodPost)
	subRoute.HandleFunc("", dc.handleGetDocuments).Methods(http.MethodGet)
	subRoute.HandleFunc("/{documentId}", dc.handleGetDocument).Methods(http.MethodGet)
}

func (dc *DocumentController) handleGetDocuments(w http.ResponseWriter, r *http.Request) {
	userId, err := uuid.Parse("ac83e344-2856-4ae1-a839-55d60c75fa12")
	documents, err := dc.documentService.GetDocumentsByUserId(userId)

	if err != nil {
		http.Error(w, "bruh", http.StatusBadRequest)
		return
	}

	if err := adapters.WriteJSON(w, http.StatusOK, documents); err != nil {
		http.Error(w, "bruh", http.StatusInternalServerError)
	}
}

func (dc *DocumentController) handleNewDocument(w http.ResponseWriter, r *http.Request) {
	var request dtos.NewDocumentRequestDTO
	err := adapters.ReadBody(r, &request)

	if err != nil {
		http.Error(w, "Invalid Document schema", http.StatusBadRequest)
		return
	}

	document, err := dc.documentService.CreateDocument(request.Title, request.OwnerId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := adapters.WriteJSON(w, http.StatusCreated, document); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (dc *DocumentController) handleGetDocument(w http.ResponseWriter, r *http.Request) {
	documentId, err := uuid.Parse(mux.Vars(r)["documentId"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	document, err := dc.documentService.GetDocumentById(documentId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	characters, err := dc.documentService.GetCharacters(documentId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := dtos.GetDocumentResponseDTO{Characters: characters, Document: document}
	if err := adapters.WriteJSON(w, http.StatusOK, response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
