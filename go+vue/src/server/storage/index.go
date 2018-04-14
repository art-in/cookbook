package storage

import (
	"database/sql"
	"errors"
	"log"
)

var db *sql.DB
var imagesFolder string

// ErrNotFound indicates that target entity not found in storage
var ErrNotFound = errors.New("Not found")

// InitStorage initializes database before fetching data
func InitStorage(dbCon string, imgFolder string) {
	var err error
	db, err = sql.Open("postgres", dbCon)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to database.")

	createTables()

	imagesFolder = imgFolder
}
