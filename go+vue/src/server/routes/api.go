package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"server/model"
	"server/storage"
	"server/utils"

	"github.com/gorilla/mux"
	"github.com/pkg/errors"
)

func handleAPI(router *mux.Router) {
	router.HandleFunc("/api/recipes", getRecipes).Methods("GET")
	router.HandleFunc("/api/recipes", postRecipe).Methods("POST")
	router.HandleFunc("/api/recipes/{id}", getRecipe).Methods("GET")
	router.HandleFunc("/api/recipes/{id}", putRecipe).Methods("PUT")
	router.HandleFunc("/api/recipes/{id}", deleteRecipe).Methods("DELETE")
	router.HandleFunc("/api/recipes/{id}/image", getRecipeImage).Methods("GET")
	router.HandleFunc("/api/recipes/{id}/image", postRecipeImage).Methods("POST")
	router.HandleFunc("/api/recipes/{id}/image", deleteRecipeImage).Methods("DELETE")
}

func getRecipes(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	sortProp := utils.DefaultString(q.Get("sp"), "name")
	sortDir := utils.DefaultString(q.Get("sd"), "asc")
	pageOffset := utils.DefaultInteger(q.Get("po"), 0)
	pageLimit := utils.DefaultInteger(q.Get("pl"), 100)

	entities, err := storage.GetRecipes(sortProp, sortDir, pageOffset, pageLimit)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	out, err := json.Marshal(entities)
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

func getRecipeImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		err := errors.Wrap(err, "invalid params")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	image, err := storage.GetRecipeImage(id)
	defer image.Close()

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

	_, err = io.Copy(w, image)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	// TODO: add cache headers
}

func postRecipeImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		err := errors.Wrap(err, "invalid params")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	image, err := storage.AddRecipeImage(id)
	defer image.Close()

	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	_, err = io.Copy(image, file)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
}

func deleteRecipeImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		err := errors.Wrap(err, "invalid params")
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = storage.DeleteRecipeImage(id)

	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
}
