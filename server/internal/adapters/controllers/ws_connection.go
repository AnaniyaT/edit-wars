package controllers

import (
	"github.com/ananiyat/edit-wars/server/internal/adapters/dtos"
	"github.com/ananiyat/edit-wars/server/internal/application/services"
	"net/http"
	"net/url"

	"github.com/ananiyat/edit-wars/server/internal/infrastructure/websocket"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type WebsocketAdapter struct {
	hub             *websocket.Hub
	documentService *services.DocumentService
}

func NewWebsocketAdapter(hub *websocket.Hub, ds *services.DocumentService) *WebsocketAdapter {
	return &WebsocketAdapter{hub: hub, documentService: ds}
}

func (ws *WebsocketAdapter) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/ws", ws.WebsocketConnectHandler)
}

func (ws *WebsocketAdapter) WebsocketConnectHandler(w http.ResponseWriter, r *http.Request) {
	req, err := parseQueryParams(r.URL.Query())

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	exists, err := ws.documentService.Exists(req.DocumentId)
	if err != nil || !exists {
		http.Error(w, "Document does not exist", http.StatusNotFound)
	}

	websocket.ServeWs(ws.hub, req.ClientId, req.DocumentId, w, r)
}

func validateToken(token string) (uuid.UUID, error) {
	return uuid.Parse(token)
}

func parseQueryParams(params url.Values) (dtos.WsConnectionDto, error) {
	var res dtos.WsConnectionDto
	token := params.Get("tkn")
	userId, err := validateToken(token)
	if err != nil {
		return res, err
	}

	clientId, err := uuid.Parse(params.Get("cid"))
	if err != nil {
		return res, err
	}

	docId, err := uuid.Parse(params.Get("d"))
	if err != nil {
		return res, err
	}

	res = dtos.WsConnectionDto{UserId: userId, ClientId: clientId, DocumentId: docId}

	return res, nil
}
