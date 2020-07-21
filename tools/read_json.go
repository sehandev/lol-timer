package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

const championFilePath string = "../static/json/champion.json"

type champion struct {
	Type    string      `json:"type"`
	Format  string      `json:"format"`
	Version string      `json:"version"`
	Data    interface{} `json:"data"`
}

func readJSON() (championNameArr []string) {

	// 파일 열기
	jsonFile, err := os.Open(championFilePath)
	checkError(err)
	defer jsonFile.Close()

	// 파일 읽기
	byteValue, err := ioutil.ReadAll(jsonFile)
	checkError(err)

	// json 분석
	var champ champion
	err = json.Unmarshal(byteValue, &champ)
	checkError(err)

	// champion 이름인 key 구하기
	for key := range champ.Data.(map[string]interface{}) {
		championNameArr = append(championNameArr, key)
	}

	return
}
