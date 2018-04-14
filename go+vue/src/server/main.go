package main

import (
	"server/api"
	"server/storage"
)

func main() {
	cfg := loadConfig()

	storage.InitStorage(cfg.Server.DbConStr, cfg.Server.ImageFolder)
	api.Serve(cfg.Server.APIURL)
}
