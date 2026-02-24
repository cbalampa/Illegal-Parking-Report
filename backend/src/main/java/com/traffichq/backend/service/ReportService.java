package com.traffichq.backend.service;

import com.traffichq.backend.dto.report.*;
import com.traffichq.backend.entity.Report;
import com.traffichq.backend.entity.User;
import com.traffichq.backend.entity.Vehicle;
import com.traffichq.backend.enums.ReportStatus;
import com.traffichq.backend.exception.NotFoundException;
import com.traffichq.backend.repository.ReportRepository;
import com.traffichq.backend.repository.UserRepository;
import com.traffichq.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public ReportResponse createReport(Long userId, ReportRequest request, MultipartFile photo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));

        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = cloudinaryService.upload(photo);
        }

        Report report = new Report();
        report.setUser(user);
        report.setLicensePlate(request.getLicensePlate());
        report.setViolationType(request.getViolationType());
        report.setLocationAddress(request.getLocationAddress());
        report.setLocationLatitude(request.getLocationLatitude());
        report.setLocationLongitude(request.getLocationLongitude());
        report.setDescription(request.getDescription());
        report.setPhotoUrl(photoUrl);
        report.setStatus(ReportStatus.PENDING);

        Report saved = reportRepository.save(report);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getReportsByUser(Long userId) {
        return reportRepository.findByUser_UserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponse updateStatus(Long reportId, ReportStatusUpdateRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException("Report not found: " + reportId));

        report.setStatus(request.getStatus());
        Report saved = reportRepository.save(report);

        if (request.getStatus() == ReportStatus.FULFILLED
                || request.getStatus() == ReportStatus.DECLINED) {
            autoCloseDuplicates(saved);
        }

        return toResponse(saved);
    }

    private void autoCloseDuplicates(Report resolvedReport) {
        LocalDate resolvedDate = resolvedReport.getCreatedAt().toLocalDate();

        List<Report> candidates = reportRepository.findByLicensePlateAndViolationTypeAndStatusIn(
                resolvedReport.getLicensePlate(),
                resolvedReport.getViolationType(),
                List.of(ReportStatus.PENDING, ReportStatus.IN_PROGRESS)
        );

        for (Report candidate : candidates) {
            if (candidate.getReportId().equals(resolvedReport.getReportId())) continue;

            LocalDate candidateDate = candidate.getCreatedAt().toLocalDate();
            if (candidateDate.equals(resolvedDate)) {
                candidate.setStatus(ReportStatus.DECLINED);
                reportRepository.save(candidate);
            }
        }
    }

    private ReportResponse toResponse(Report report) {
        Optional<Vehicle> vehicle = vehicleRepository.findByLicensePlate(report.getLicensePlate());

        VehicleInfo vehicleInfo = vehicle.map(v -> new VehicleInfo(
                v.getOwnerName(),
                v.getOwnerEmail(),
                v.getVehicleManufacturer(),
                v.getVehicleModel(),
                v.getVehicleColor()
        )).orElse(null);

        return new ReportResponse(
                report.getReportId(),
                report.getUser().getUserId(),
                report.getUser().getEmail(),
                report.getLicensePlate(),
                report.getViolationType(),
                report.getLocationAddress(),
                report.getLocationLatitude(),
                report.getLocationLongitude(),
                report.getPhotoUrl(),
                report.getDescription(),
                report.getStatus(),
                report.getCreatedAt(),
                report.getUpdatedAt(),
                vehicleInfo
        );
    }
}