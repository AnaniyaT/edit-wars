package controllers

import (
	"encoding/json"

	"github.com/ananiyat/edit-wars/server/internal/application/services"
	"github.com/ananiyat/edit-wars/server/internal/infrastructure/websocket"

	"github.com/gorilla/mux"
)

type OperationAdapter struct {
	hub              *websocket.Hub
	operationService *services.OperationService
}

func NewOperationAdapter(hub *websocket.Hub, operationService *services.OperationService) *OperationAdapter {
	return &OperationAdapter{hub: hub, operationService: operationService}
}

func (oa *OperationAdapter) RegisterRoutes(router *mux.Router) {
	oa.hub.OnMessage("operation", oa.handleOperation)
}

func (oa *OperationAdapter) handleOperation(message websocket.Message) {
	var wsMessage websocket.WSMessage
	error := json.Unmarshal(message.Data, &wsMessage)

	if error != nil {
		return
	}

	oa.hub.Broadcast(message)
}
