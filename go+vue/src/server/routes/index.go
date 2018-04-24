package routes

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// Serve starts http server to serve static files and rest api
func Serve(url, ServeFolder string) {
	router := mux.NewRouter()

	handleAPI(router)

	router.PathPrefix("/").Handler(http.FileServer(http.Dir(ServeFolder)))

	handler := handlers.LoggingHandler(os.Stdout, router)

	log.Printf("Listening at %s...\n", url)
	log.Fatal(http.ListenAndServe(url, handler))
}
