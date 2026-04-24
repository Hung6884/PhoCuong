package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"phocuong/config"
	"phocuong/models"
)

func GetDashboardStats(c *gin.Context) {
	var totalUsers, totalOrders, totalReservations, pendingOrders, pendingReservations int64
	var totalRevenue float64

	config.DB.Model(&models.User{}).Where("role = ?", models.RoleCustomer).Count(&totalUsers)
	config.DB.Model(&models.Order{}).Count(&totalOrders)
	config.DB.Model(&models.Reservation{}).Count(&totalReservations)
	config.DB.Model(&models.Order{}).Where("status = ?", models.OrderPending).Count(&pendingOrders)
	config.DB.Model(&models.Reservation{}).Where("status = ?", models.ReservationPending).Count(&pendingReservations)
	config.DB.Model(&models.Order{}).
		Where("status IN ?", []models.OrderStatus{models.OrderDelivered}).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalRevenue)

	var recentOrders []models.Order
	config.DB.Preload("Customer").Preload("Items.MenuItem").
		Order("created_at DESC").Limit(5).Find(&recentOrders)

	var recentReservations []models.Reservation
	config.DB.Preload("Customer").Order("created_at DESC").Limit(5).Find(&recentReservations)

	c.JSON(http.StatusOK, gin.H{
		"total_users":          totalUsers,
		"total_orders":         totalOrders,
		"total_reservations":   totalReservations,
		"pending_orders":       pendingOrders,
		"pending_reservations": pendingReservations,
		"total_revenue":        totalRevenue,
		"recent_orders":        recentOrders,
		"recent_reservations":  recentReservations,
	})
}

func GetAllUsers(c *gin.Context) {
	var users []models.User
	query := config.DB.Order("created_at DESC")
	if role := c.Query("role"); role != "" {
		query = query.Where("role = ?", role)
	}
	query.Find(&users)
	c.JSON(http.StatusOK, users)
}

func UpdateUserRole(c *gin.Context) {
	var input struct {
		Role models.Role `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Role != models.RoleAdmin && input.Role != models.RoleStaff && input.Role != models.RoleCustomer {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role không hợp lệ"})
		return
	}

	config.DB.Model(&models.User{}).Where("id = ?", c.Param("id")).Update("role", input.Role)
	c.JSON(http.StatusOK, gin.H{"message": "Đã cập nhật quyền"})
}

func ToggleUserActive(c *gin.Context) {
	var user models.User
	if err := config.DB.First(&user, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy người dùng"})
		return
	}
	user.Active = !user.Active
	config.DB.Save(&user)
	status := "kích hoạt"
	if !user.Active {
		status = "vô hiệu hóa"
	}
	c.JSON(http.StatusOK, gin.H{"message": "Đã " + status + " tài khoản", "active": user.Active})
}

func GetSettings(c *gin.Context) {
	var settings []models.Setting
	config.DB.Find(&settings)
	result := make(map[string]string)
	for _, s := range settings {
		result[s.Key] = s.Value
	}
	c.JSON(http.StatusOK, result)
}

func UpdateSetting(c *gin.Context) {
	var input struct {
		Value string `json:"value"`
	}
	c.ShouldBindJSON(&input)
	key := c.Param("key")

	var setting models.Setting
	config.DB.Where("key = ?", key).FirstOrCreate(&setting, models.Setting{Key: key})
	setting.Value = input.Value
	config.DB.Save(&setting)
	c.JSON(http.StatusOK, setting)
}
