package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"phocuong/config"
	"phocuong/models"
)

func GetGallery(c *gin.Context) {
	var items []models.Gallery
	query := config.DB.Order("sort_order, created_at DESC")
	if cat := c.Query("category"); cat != "" {
		query = query.Where("category = ?", cat)
	}
	if c.Query("featured") == "true" {
		query = query.Where("featured = true")
	}
	query.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateGalleryItem(c *gin.Context) {
	var input models.Gallery
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}

func UpdateGalleryItem(c *gin.Context) {
	var item models.Gallery
	if err := config.DB.First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy"})
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

func DeleteGalleryItem(c *gin.Context) {
	config.DB.Delete(&models.Gallery{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Đã xóa"})
}

func GetReviews(c *gin.Context) {
	var reviews []models.Review
	config.DB.Preload("Customer").Where("approved = true").Order("created_at DESC").Find(&reviews)
	c.JSON(http.StatusOK, reviews)
}

func CreateReview(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input struct {
		Rating  int    `json:"rating" binding:"required,min=1,max=5"`
		Comment string `json:"comment"`
		OrderID *uint  `json:"order_id"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	review := models.Review{
		CustomerID: userID,
		Rating:     input.Rating,
		Comment:    input.Comment,
		OrderID:    input.OrderID,
	}
	config.DB.Create(&review)
	c.JSON(http.StatusCreated, gin.H{"message": "Cảm ơn đánh giá của bạn! Đánh giá sẽ được kiểm duyệt."})
}

func ApproveReview(c *gin.Context) {
	config.DB.Model(&models.Review{}).Where("id = ?", c.Param("id")).Update("approved", true)
	c.JSON(http.StatusOK, gin.H{"message": "Đã duyệt đánh giá"})
}

func GetAllReviews(c *gin.Context) {
	var reviews []models.Review
	config.DB.Preload("Customer").Order("created_at DESC").Find(&reviews)
	c.JSON(http.StatusOK, reviews)
}
