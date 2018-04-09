package storage

import (
	"database/sql"
	"errors"
	"log"

	"server/model"

	// register postgres driver
	_ "github.com/lib/pq"
)

var db *sql.DB

// ErrNotFound indicates that target entity not found in storage
var ErrNotFound = errors.New("Not found")

// InitDB initializes database before fetching data
func InitDB(con string) {
	var err error
	db, err = sql.Open("postgres", con)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to database.")

	createTables()
}

func createTables() {
	_, err := db.Exec(
		`CREATE TABLE IF NOT EXISTS recipes (
			id serial PRIMARY KEY,
			name varchar(50) NOT NULL,
			description varchar(100) NOT NULL,
			complexity SMALLINT NOT NULL,
			popularity SMALLINT NOT NULL
		)`)

	if err != nil {
		log.Fatal(err)
	}
}

// GetRecipes gets all recipes
func GetRecipes() ([]model.Recipe, error) {
	rows, err := db.Query(`
		SELECT id, name, description, complexity, popularity
		FROM recipes`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	recipes := make([]model.Recipe, 0)

	for rows.Next() {
		r := model.Recipe{}

		err = rows.Scan(&r.ID, &r.Name, &r.Description, &r.Complexity, &r.Popularity)
		if err != nil {
			return nil, err
		}

		recipes = append(recipes, r)
	}

	err = rows.Err()
	if err != nil {
		return nil, err
	}

	return recipes, nil
}

// AddRecipe adds new recipe
func AddRecipe(recipe model.Recipe) error {
	_, err := db.Exec(`
		INSERT INTO recipes(name, description, complexity, popularity)
		VALUES ($1, $2, $3, $4)`,
		recipe.Name,
		recipe.Description,
		recipe.Complexity,
		recipe.Popularity)

	return err
}

// GetRecipe gets one existing recipe
func GetRecipe(id int64) (model.Recipe, error) {
	r := model.Recipe{}

	row := db.QueryRow(`
		SELECT id, name, description, complexity, popularity
		FROM recipes
		WHERE id = $1`,
		id)

	err := row.Scan(&r.ID, &r.Name, &r.Description, &r.Complexity, &r.Popularity)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return r, ErrNotFound
		default:
			return r, err
		}
	}

	return r, nil
}

// UpdateRecipe updates existing recipe
func UpdateRecipe(id int64, recipe model.Recipe) error {
	res, err := db.Exec(`
		UPDATE recipes
		SET
			name = $2,
			description = $3,
			complexity = $4,
			popularity = $5
		WHERE
			id = $1`,
		id,
		recipe.Name,
		recipe.Description,
		recipe.Complexity,
		recipe.Popularity)

	if err != nil {
		return err
	}

	if count, _ := res.RowsAffected(); count == 0 {
		return ErrNotFound
	}

	return nil
}

// DeleteRecipe deletes existing recipe
func DeleteRecipe(id int64) error {
	res, err := db.Exec(`
		DELETE FROM recipes
		WHERE id = $1`,
		id)

	if count, _ := res.RowsAffected(); count == 0 {
		return ErrNotFound
	}

	return err
}
