package main

import (
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

const (
	championDirPath    string = "../static/img/champion/"                                      // 사진 저장할 directory
	ddragonChampionURL string = "http://ddragon.leagueoflegends.com/cdn/10.14.1/img/champion/" // champion URL
)

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	// TODO : https://ddragon.leagueoflegends.com/api/versions.json 에서 최신 버전 찾기

	championNameArr, championNameIDMap := readJSON()

	for _, championName := range championNameArr {
		// championName : champion 영어 이름

		fullURL := ddragonChampionURL + championName + ".png"
		client := httpClient()

		// URL로부터 fileName 분리
		fileName := buildFileName(fullURL)

		// championDirPath에 file 만들기
		file := createFile(fileName)

		// 만든 file에 사진 저장
		putFile(file, client, fullURL)
	}

	writeChampionIDFile(championNameIDMap)
}

func httpClient() *http.Client {
	client := http.Client{
		CheckRedirect: func(r *http.Request, via []*http.Request) error {
			r.URL.Opaque = r.URL.Path
			return nil
		},
	}

	return &client
}

func buildFileName(fullURL string) (fileName string) {
	fileURL, err := url.Parse(fullURL)
	checkError(err)

	path := fileURL.Path

	segments := strings.Split(path, "/")
	fileName = segments[len(segments)-1]

	return
}

func createFile(fileName string) (file *os.File) {
	file, err := os.Create(championDirPath + fileName)
	checkError(err)

	return
}

func putFile(file *os.File, client *http.Client, fullURL string) {
	resp, err := client.Get(fullURL)
	checkError(err)
	defer resp.Body.Close()

	_, err = io.Copy(file, resp.Body)
	defer file.Close()
	checkError(err)
}
