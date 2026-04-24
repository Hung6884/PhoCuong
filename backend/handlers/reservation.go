package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"phocuong/config"
	"phocuong/models"
)

func CreateReservation(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input struct {
		Date     string `json:"date" binding:"required"`
		TimeSlot string `json:"time_slot" binding:"required"`
		Guests   int    `json:"guests" binding:"required,min=1,max=20"`
		Note     string `json:"note"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	date, err := parseDate(input.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Định dạng ngày không hợp lệ (YYYY-MM-DD)"})
		return
	}

	reservation := models.Reservation{
		CustomerID: userID,
		Date:       date,
		TimeSlot:   input.TimeSlot,
		Guests:     input.Guests,
		Note:       input.Note,
		Status:     models.ReservationPending,
	}

	if err := config.DB.Create(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo đặt bàn"})
		return
	}

	config.DB.Preload("Customer").First(&reservation, reservation.ID)
	c.JSON(http.StatusCreated, reservation)
}

func GetMyReservations(c *gin.Context) {
	userID := c.GetUint("user_id")
	var reservations []models.Reservation
	config.DB.Preload("Customer").Preload("Staff").
		Where("customer_id = ?", userID).
		Order("created_at DESC").
		Find(&reservations)
	c.JSON(http.StatusOK, reservations)
}

func GetAllReservations(c *gin.Context) {
	var reservations []models.Reservation
	query := config.DB.Preload("Customer").Preload("Staff").Order("date DESC, time_slot")

	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}
	if date := c.Query("date"); date != "" {
		query = query.Where("DATE(date) = ?", date)
	}

	query.Find(&reservations)
	c.JSON(http.StatusOK, reservations)
}

func UpdateReservationStatus(c *gin.Context) {
	staffID := c.GetUint("user_id")
	var reservation models.Reservation
	if err := config.DB.First(&reservation, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đặt bàn"})
		return
	}

	var input struct {
		Status    models.ReservationStatus `json:"status" binding:"required"`
		StaffNote string                   `json:"staff_note"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	reservation.Status = input.Status
	reservation.StaffNote = input.StaffNote
	reservation.HandledBy = &staffID
	config.DB.Save(&reservation)

	config.DB.Preload("Customer").Preload("Staff").First(&reservation, reservation.ID)
	c.JSON(http.StatusOK, reservation)
}

func CancelReservation(c *gin.Context) {
	userID := c.GetUint("user_id")
	role := c.GetString("role")

	var reservation models.Reservation
	if err := config.DB.First(&reservation, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đặt bàn"})
		return
	}

	if role == "customer" && reservation.CustomerID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Không có quyền"})
		return
	}

	reservation.Status = models.ReservationCancelled
	config.DB.Save(&reservation)
	c.JSON(http.StatusOK, gin.H{"message": "Đã hủy đặt bàn"})
}
