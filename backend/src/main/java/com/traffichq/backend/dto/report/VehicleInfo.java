package com.traffichq.backend.dto.report;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VehicleInfo {
    private String ownerName;
    private String ownerEmail;
    private String vehicleManufacturer;
    private String vehicleModel;
    private String vehicleColor;
}