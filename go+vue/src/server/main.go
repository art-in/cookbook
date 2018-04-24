package main

import (
	"server/routes"
	"server/storage"
)

func main() {
	cfg := loadConfig()

	storage.InitStorage(cfg.DbConStr, cfg.ImageFolder)
	routes.Serve(cfg.APIURL, cfg.ServeFolder)
}
