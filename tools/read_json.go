package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type champion struct {
	Type    string      `json:"type"`
	Format  string      `json:"format"`
	Version string      `json:"version"`
	Data    interface{} `json:"data"`
}

func readJSON() (championNameArr []string) {
	// Open our jsonFile
	jsonFile, err := os.Open("../static/json/champion.json")
	checkError(err)
	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)
	checkError(err)

	var champ champion
	err = json.Unmarshal(byteValue, &champ)
	checkError(err)

	for key := range champ.Data.(map[string]interface{}) {
		championNameArr = append(championNameArr, key)
	}

	fmt.Println(championNameArr)

	return
}
