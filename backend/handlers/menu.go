package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"phocuong/config"
	"phocuong/models"
)

func GetMenuItems(c *gin.Context) {
	var items []models.MenuItem
	query := config.DB.Order("category, sort_order, created_at")

	if cat := c.Query("category"); cat != "" {
		query = query.Where("category = ?", cat)
	}
	if c.Query("available") == "true" {
		query = query.Where("available = true")
	}
	if c.Query("featured") == "true" {
		query = query.Where("featured = true")
	}

	query.Find(&items)
	c.JSON(http.StatusOK, items)
}

func GetMenuItem(c *gin.Context) {
	var item models.MenuItem
	if err := config.DB.First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy món"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func CreateMenuItem(c *gin.Context) {
	var input models.MenuItem
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo món"})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateMenuItem(c *gin.Context) {
	var item models.MenuItem
	if err := config.DB.First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy món"})
		return
	}
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id, _ := strconv.Atoi(c.Param("id"))
	item.ID = uint(id)
	config.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteMenuItem(c *gin.Context) {
	if err := config.DB.Delete(&models.MenuItem{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xóa"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Đã xóa món"})
}
