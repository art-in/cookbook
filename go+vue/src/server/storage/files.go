package storage

import (
	"fmt"
	"log"
	"os"
)

// GetRecipeImage returns recipe image from file storage
func GetRecipeImage(recipeID int64) (*os.File, error) {
	filePath := fmt.Sprintf("%s%d", imagesFolder, recipeID)
	file, err := os.OpenFile(filePath, os.O_RDONLY, 0666)

	if err != nil {
		log.Println(err)
		if os.IsNotExist(err) {
			return nil, ErrNotFound
		}

		return nil, err
	}

	return file, nil
}

// AddRecipeImage adds recipe image to file storage
func AddRecipeImage(recipeID int64) (*os.File, error) {
	imagePath := fmt.Sprintf("%s%d", imagesFolder, recipeID)
	image, err := os.OpenFile(imagePath, os.O_WRONLY|os.O_CREATE, 0666)

	return image, err
}

// DeleteRecipeImage deletes recipe image from file storage
func DeleteRecipeImage(recipeID int64) error {
	filePath := fmt.Sprintf("%s%d", imagesFolder, recipeID)
	err := os.Remove(filePath)

	return err
}
