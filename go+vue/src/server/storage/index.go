package storage

import (
	"errors"
)

// ErrNotFound indicates that target entity not found in storage
var ErrNotFound = errors.New("Not found")

// InitStorage initializes database and file storage
func InitStorage(dbCon string, imgFolder string) {
	initDBStorage(dbCon)
	initFileStorage(imgFolder)
}
