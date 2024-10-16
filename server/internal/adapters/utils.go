package adapters

import (
	"encoding/json"
	"net/http"
)

func ReadBody[T any](r *http.Request, output *T) error {
	return json.NewDecoder(r.Body).Decode(output)
}

func WriteJSON(w http.ResponseWriter, statusCode int, output interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	return json.NewEncoder(w).Encode(output)
}
