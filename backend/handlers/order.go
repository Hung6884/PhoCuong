package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"phocuong/config"
	"phocuong/models"
)

type OrderItemInput struct {
	MenuItemID uint   `json:"menu_item_id" binding:"required"`
	Quantity   int    `json:"quantity" binding:"required,min=1"`
	Note       string `json:"note"`
}

func CreateOrder(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input struct {
		Items       []OrderItemInput `json:"items" binding:"required,min=1"`
		TableNumber string           `json:"table_number"`
		Note        string           `json:"note"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var total float64
	var orderItems []models.OrderItem

	for _, item := range input.Items {
		var menuItem models.MenuItem
		if err := config.DB.First(&menuItem, item.MenuItemID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Món không tồn tại"})
			return
		}
		if !menuItem.Available {
			c.JSON(http.StatusBadRequest, gin.H{"error": menuItem.Name + " hiện không có sẵn"})
			return
		}
		subtotal := menuItem.Price * float64(item.Quantity)
		total += subtotal
		orderItems = append(orderItems, models.OrderItem{
			MenuItemID: item.MenuItemID,
			Quantity:   item.Quantity,
			Price:      menuItem.Price,
			Note:       item.Note,
		})
	}

	order := models.Order{
		CustomerID:  userID,
		Items:       orderItems,
		TotalAmount: total,
		Status:      models.OrderPending,
		Note:        input.Note,
		TableNumber: input.TableNumber,
	}

	if err := config.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo đơn hàng"})
		return
	}

	config.DB.Preload("Customer").Preload("Items.MenuItem").First(&order, order.ID)
	c.JSON(http.StatusCreated, order)
}

func GetMyOrders(c *gin.Context) {
	userID := c.GetUint("user_id")
	var orders []models.Order
	config.DB.Preload("Items.MenuItem").Preload("Staff").
		Where("customer_id = ?", userID).
		Order("created_at DESC").
		Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func GetAllOrders(c *gin.Context) {
	var orders []models.Order
	query := config.DB.Preload("Customer").Preload("Items.MenuItem").Preload("Staff").
		Order("created_at DESC")

	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	query.Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func UpdateOrderStatus(c *gin.Context) {
	staffID := c.GetUint("user_id")
	var order models.Order
	if err := config.DB.First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn hàng"})
		return
	}

	var input struct {
		Status models.OrderStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order.Status = input.Status
	order.HandledBy = &staffID
	config.DB.Save(&order)
	config.DB.Preload("Customer").Preload("Items.MenuItem").Preload("Staff").First(&order, order.ID)
	c.JSON(http.StatusOK, order)
}

func parseDate(s string) (time.Time, error) {
	return time.Parse("2006-01-02", s)
}
