package storage

import (
	"database/sql"
	"errors"
	"fmt"
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
			popularity SMALLINT NOT NULL,
			ingredients JSON NOT NULL,
			steps JSON NOT NULL
		)`)

	if err != nil {
		log.Fatal(err)
	}
}

// GetRecipes gets all recipes
func GetRecipes(sortProp, sortDir string, pageOffset, pageLimit int) (*EntitySubset, error) {
	// use usual string templating here to be able to pass sort direction param
	query := fmt.Sprintf(`
		SELECT id, name, description, complexity, popularity, ingredients, steps
		FROM recipes
		ORDER BY %s %s
		OFFSET %d LIMIT %d`,
		sortProp, sortDir,
		pageOffset, pageLimit)

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	recipes := make([]model.Recipe, 0)

	for rows.Next() {
		r := model.Recipe{}

		err = rows.Scan(
			&r.ID,
			&r.Name,
			&r.Description,
			&r.Complexity,
			&r.Popularity,
			&r.Ingredients,
			&r.Steps)

		if err != nil {
			return nil, err
		}

		recipes = append(recipes, r)
	}

	err = rows.Err()
	if err != nil {
		return nil, err
	}

	var count int
	row := db.QueryRow("SELECT COUNT (*) FROM recipes")
	err = row.Scan(&count)
	if err != nil {
		return nil, err
	}

	return &EntitySubset{Items: recipes, TotalCount: count}, nil
}

// AddRecipe adds new recipe
func AddRecipe(recipe model.Recipe) (int, error) {
	var id int
	err := db.QueryRow(`
		INSERT INTO recipes(name, description, complexity, popularity, ingredients, steps)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`,
		recipe.Name,
		recipe.Description,
		recipe.Complexity,
		recipe.Popularity,
		recipe.Ingredients,
		recipe.Steps).Scan(&id)

	return id, err
}

// GetRecipe gets one existing recipe
func GetRecipe(id int64) (model.Recipe, error) {
	r := model.Recipe{}

	row := db.QueryRow(`
		SELECT id, name, description, complexity, popularity, ingredients, steps
		FROM recipes
		WHERE id = $1`,
		id)

	err := row.Scan(
		&r.ID,
		&r.Name,
		&r.Description,
		&r.Complexity,
		&r.Popularity,
		&r.Ingredients,
		&r.Steps)

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
			popularity = $5,
			ingredients = $6,
			steps = $7
		WHERE
			id = $1`,
		id,
		recipe.Name,
		recipe.Description,
		recipe.Complexity,
		recipe.Popularity,
		recipe.Ingredients,
		recipe.Steps)

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
