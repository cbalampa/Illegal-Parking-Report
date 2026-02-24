package com.traffichq.backend.controller;

import com.traffichq.backend.dto.report.ReportRequest;
import com.traffichq.backend.dto.report.ReportResponse;
import com.traffichq.backend.dto.report.ReportStatusUpdateRequest;
import com.traffichq.backend.enums.ViolationType;
import com.traffichq.backend.security.AuthenticatedUser;
import com.traffichq.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> createReport(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam String licensePlate,
            @RequestParam String violationType,
            @RequestParam String locationAddress,
            @RequestParam BigDecimal locationLatitude,
            @RequestParam BigDecimal locationLongitude,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile photo) {

        ReportRequest request = new ReportRequest();
        request.setLicensePlate(licensePlate);
        request.setViolationType(ViolationType.valueOf(violationType));
        request.setLocationAddress(locationAddress);
        request.setLocationLatitude(locationLatitude);
        request.setLocationLongitude(locationLongitude);
        request.setDescription(description);

        ReportResponse response = reportService.createReport(
                currentUser.getUserId(), request, photo
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ReportResponse>> getMyReports(
            @AuthenticationPrincipal AuthenticatedUser currentUser) {
        return ResponseEntity.ok(reportService.getReportsByUser(currentUser.getUserId()));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PatchMapping("/{reportId}/status")
    public ResponseEntity<ReportResponse> updateStatus(
            @PathVariable Long reportId,
            @RequestBody ReportStatusUpdateRequest request) {
        return ResponseEntity.ok(reportService.updateStatus(reportId, request));
    }
}