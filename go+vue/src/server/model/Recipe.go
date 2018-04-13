package model

import (
	"encoding/json"
)

// Recipe model represents cooking recipe
type Recipe struct {
	ID          int             `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Complexity  int             `json:"complexity"`
	Popularity  int             `json:"popularity"`
	Ingredients json.RawMessage `json:"ingredients"`
	Steps       json.RawMessage `json:"steps"`
}
