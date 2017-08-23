package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Serving files in the current directory on port 8082")
	http.Handle("/", http.FileServer(http.Dir(".")))
	err := http.ListenAndServe("localhost:8082", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
