package com.traffichq.backend.dto.report;

import com.traffichq.backend.enums.ViolationType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ReportRequest {
    private String licensePlate;
    private ViolationType violationType;
    private String locationAddress;
    private BigDecimal locationLatitude;
    private BigDecimal locationLongitude;
    private String description;
}