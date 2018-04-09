package main

import (
	"server/api"
	"server/storage"
)

func main() {
	cnf := loadConfig()

	storage.InitDB(cnf.Server.DbConStr)
	api.Serve(cnf.Server.APIURL)
}
