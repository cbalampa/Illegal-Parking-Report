package com.traffichq.backend.dto.report;

import com.traffichq.backend.enums.ReportStatus;
import com.traffichq.backend.enums.ViolationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReportResponse {
    private Long reportId;
    private Long userId;
    private String userEmail;
    private String licensePlate;
    private ViolationType violationType;
    private String locationAddress;
    private BigDecimal locationLatitude;
    private BigDecimal locationLongitude;
    private String photo_url;
    private String description;
    private ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private VehicleInfo vehicleInfo; // null if plate not found in vehicles table
}