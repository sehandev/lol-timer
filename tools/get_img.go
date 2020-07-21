package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

const (
	championDirPath    string = "../static/img/champion/"
	ddragonChampionURL string = "http://ddragon.leagueoflegends.com/cdn/10.14.1/img/champion/"
)

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {

	championNameArr := readJSON()

	for _, championName := range championNameArr {

		fullURL := ddragonChampionURL + championName + ".png"
		client := httpClient()

		// Build fileName from fullPath
		fileName := buildFileName(fullURL)

		// Create blank file
		file := createFile(fileName)

		// Put content on file
		fileSize := putFile(file, client, fullURL)

		fmt.Printf("Just Downloaded a file %s with size %d\n", fileName, fileSize)

	}
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

func putFile(file *os.File, client *http.Client, fullURL string) (size int64) {
	resp, err := client.Get(fullURL)
	checkError(err)
	defer resp.Body.Close()

	size, err = io.Copy(file, resp.Body)
	defer file.Close()
	checkError(err)

	return
}
