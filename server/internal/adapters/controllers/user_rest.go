package controllers

import (
	"errors"
	"github.com/ananiyat/edit-wars/server/internal/adapters"
	"github.com/ananiyat/edit-wars/server/internal/application/services"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
)

type UserController struct {
	userService *services.UserService
}

func NewUserController(userService *services.UserService) *UserController {
	return &UserController{userService: userService}
}

func (uc *UserController) RegisterRoutes(router *mux.Router) {
	subRoute := router.PathPrefix("/users").Subrouter()
	subRoute.HandleFunc("/{id}", uc.handleGetUser).Methods(http.MethodGet, http.MethodOptions)
}

func (uc *UserController) handleGetUser(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(mux.Vars(r)["id"])
	if err != nil {
		adapters.WriteError(w, http.StatusBadRequest, errors.New("user id required"))
		return
	}

	user, err := uc.userService.GetUser(id)
	if err != nil {
		adapters.WriteError(w, http.StatusNotFound, errors.New("can't find user"))
		return
	}
	if err := adapters.WriteJSON(w, http.StatusOK, user); err != nil {
		adapters.WriteError(w, http.StatusInternalServerError, errors.New("server error"))
	}
}
