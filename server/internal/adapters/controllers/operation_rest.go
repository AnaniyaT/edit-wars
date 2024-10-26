package controllers

import (
	"errors"
	"github.com/ananiyat/edit-wars/server/internal/adapters"
	"github.com/ananiyat/edit-wars/server/internal/adapters/dtos"
	"github.com/ananiyat/edit-wars/server/internal/application/services"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
	"net/url"
	"strconv"
)

type OperationController struct {
	operationService *services.OperationService
	middlewares      []mux.MiddlewareFunc
}

func NewOperationController(operationService *services.OperationService, middlewares ...mux.MiddlewareFunc) *OperationController {
	return &OperationController{operationService: operationService, middlewares: middlewares}
}

func (oc *OperationController) RegisterRoutes(router *mux.Router) {
	subRoute := router.PathPrefix("/operations").Subrouter()
	subRoute.HandleFunc("", oc.handleGetOperations).Methods(http.MethodGet, http.MethodOptions)

	for _, middleware := range oc.middlewares {
		subRoute.Use(middleware)
	}
}

func (oc *OperationController) handleGetOperations(w http.ResponseWriter, r *http.Request) {
	params, err := parseOpQueryParams(r.URL.Query())

	if err != nil {
		adapters.WriteError(w, http.StatusBadRequest, errors.New("Malformed query params"))
		return
	}

	operations, err := oc.operationService.FilterOperations(
		params.DocumentId, params.ClientId, params.Counter,
	)

	if err != nil {
		adapters.WriteError(w, http.StatusInternalServerError, errors.New("Couldn't get operations"))
		return
	}

	if err := adapters.WriteJSON(w, http.StatusOK, operations); err != nil {
		adapters.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}

func parseOpQueryParams(params url.Values) (dtos.GetOperationsDto, error) {
	documentId, err := uuid.Parse(params.Get("d"))
	if err != nil {
		return dtos.GetOperationsDto{}, err
	}
	req := dtos.GetOperationsDto{DocumentId: documentId}

	clientId, err := uuid.Parse(params.Get("cid"))
	if err == nil {
		req.ClientId = &clientId
	}

	counter, err := strconv.Atoi(params.Get("ctrgeq"))
	if err == nil {
		req.Counter = &counter
	}

	return req, nil
}
