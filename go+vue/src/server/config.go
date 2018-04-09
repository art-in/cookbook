package main

import (
	"encoding/json"
	"log"
	"os"
)

type config struct {
	Server configServer `json:"server"`
}

type configServer struct {
	DbConStr string `json:"dbConStr"`
	APIURL   string `json:"apiUrl"`
}

func loadConfig() config {
	file, err := os.Open("../config.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	cfg := config{}

	err = json.NewDecoder(file).Decode(&cfg)
	if err != nil {
		log.Fatal(err)
	}

	return cfg
}
