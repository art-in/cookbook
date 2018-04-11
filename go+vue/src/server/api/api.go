package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"server/model"
	"server/storage"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/pkg/errors"
)

// Serve starts rest api service over http
func Serve(url string) {
	router := mux.NewRouter()

	router.HandleFunc("/api/recipes", getRecipes).Methods("GET")
	router.HandleFunc("/api/recipes", postRecipe).Methods("POST")
	router.HandleFunc("/api/recipes/{id}", getRecipe).Methods("GET")
	router.HandleFunc("/api/recipes/{id}", putRecipe).Methods("PUT")
	router.HandleFunc("/api/recipes/{id}", deleteRecipe).Methods("DELETE")

	handler := handlers.LoggingHandler(os.Stdout, router)

	log.Printf("Listening at %s...\n", url)
	log.Fatal(http.ListenAndServe(url, handler))
}

func getRecipes(w http.ResponseWriter, r *http.Request) {
	recipes, err := storage.GetRecipes()
	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	out, err := json.Marshal(recipes)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(out))
}

func postRecipe(w http.ResponseWriter, r *http.Request) {
	recipe := model.Recipe{}

	if r.Header.Get("Content-Type") != "application/json" {
		err := "json body expected"
		log.Println(err)
		http.Error(w, err, http.StatusBadRequest)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		err := errors.Wrap(err, "invalid json")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	recipeID, err := storage.AddRecipe(recipe)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, strconv.Itoa(recipeID))
}

func getRecipe(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		err := errors.Wrap(err, "invalid params")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	recipe, err := storage.GetRecipe(id)
	if err != nil {
		log.Println(err)
		switch err {
		case storage.ErrNotFound:
			http.Error(w, "not found", http.StatusNotFound)
		default:
			http.Error(w, "internal error", http.StatusInternalServerError)
		}
		return
	}

	out, err := json.Marshal(recipe)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(out))
}

func putRecipe(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		err := errors.Wrap(err, "invalid params")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if r.Header.Get("Content-Type") != "application/json" {
		err := "json body expected"
		log.Println(err)
		http.Error(w, err, http.StatusBadRequest)
		return
	}

	recipe := model.Recipe{}

	err = json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		err := errors.Wrap(err, "invalid json")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = storage.UpdateRecipe(id, recipe)
	if err != nil {
		log.Println(err)
		switch err {
		case storage.ErrNotFound:
			http.Error(w, "not found", http.StatusNotFound)
		default:
			http.Error(w, "internal error", http.StatusInternalServerError)
		}
		return
	}
}

func deleteRecipe(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		err := errors.Wrap(err, "invalid params")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = storage.DeleteRecipe(id)
	if err != nil {
		log.Println(err)
		switch err {
		case storage.ErrNotFound:
			http.Error(w, "not found", http.StatusNotFound)
		default:
			http.Error(w, "internal error", http.StatusInternalServerError)
		}
		return
	}
}
