package domain

import (
	"time"

	"github.com/google/uuid"
)

type ContactInquiry struct {
	ID               uuid.UUID  `json:"id"`
	Name             string     `json:"name"`
	CompanyName      string     `json:"companyName,omitempty"`
	Email            string     `json:"email"`
	Phone            string     `json:"phone,omitempty"`
	Subject          string     `json:"subject"`
	Message          string     `json:"message"`
	InterestCategory string     `json:"interestCategory"`
	IPAddress        string     `json:"ipAddress,omitempty"`
	UserAgent        string     `json:"userAgent,omitempty"`
	Status           string     `json:"status"` // NEW, READ, CONTACTED, ARCHIVED
	IsSpam           bool       `json:"isSpam"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
	DeletedAt        *time.Time `json:"deletedAt,omitempty"`
}

type ContactSubmitRequest struct {
	Name             string `json:"name"`
	CompanyName      string `json:"companyName"`
	Email            string `json:"email"`
	Phone            string `json:"phone"`
	Subject          string `json:"subject"`
	Message          string `json:"message"`
	InterestCategory string `json:"interestCategory"`
	Honeypot         string `json:"website,omitempty"` // Honeypot trap: if filled, mark as spam
}
