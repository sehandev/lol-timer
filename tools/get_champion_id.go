package main

import (
	"bufio"
	"os"
	"strconv"
)

func writeChampionIDFile(championNameIDMap map[int]string) {
	f, err := os.Create("../static/etc/champion_id.txt")
	checkError(err)
	defer f.Close()

	w := bufio.NewWriter(f)
	for id, name := range championNameIDMap {
		_, err = w.WriteString(strconv.Itoa(id) + " " + name + "\n")
	}
	checkError(err)

	w.Flush()
}
