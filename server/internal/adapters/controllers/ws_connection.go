package controllers

import (
	"fmt"
	"github.com/ananiyat/edit-wars/server/internal/adapters"
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
	authService     *services.AuthService
}

func NewWebsocketAdapter(hub *websocket.Hub, ds *services.DocumentService, as *services.AuthService) *WebsocketAdapter {
	return &WebsocketAdapter{hub: hub, documentService: ds, authService: as}
}

func (ws *WebsocketAdapter) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/ws", ws.WebsocketConnectHandler)
}

func (ws *WebsocketAdapter) WebsocketConnectHandler(w http.ResponseWriter, r *http.Request) {
	req, err := parseWSQueryParams(r.URL.Query(), ws.authService)
	fmt.Println(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	exists, err := ws.documentService.Exists(req.DocumentId)
	if err != nil || !exists {
		http.Error(w, "Document does not exist", http.StatusNotFound)
	}

	websocket.ServeWs(ws.hub, req.ClientId, req.DocumentId, req.UserId, w, r)
}

func validateToken(token string, service *services.AuthService) (uuid.UUID, error) {
	authDto, err := adapters.DecodeAuthHeader("Basic " + token)
	if err != nil {
		fmt.Println(err.Error())
		return uuid.Nil, err
	}

	userId, err := service.Authenticate(authDto.Username, authDto.Password)
	if err != nil {
		return uuid.Nil, err
	}

	return userId, nil
}

func parseWSQueryParams(params url.Values, service *services.AuthService) (dtos.WsConnectionDto, error) {
	var res dtos.WsConnectionDto
	token := params.Get("tkn")
	userId, err := validateToken(token, service)

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
