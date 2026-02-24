package com.traffichq.backend.repository;

import com.traffichq.backend.entity.Report;
import com.traffichq.backend.enums.ReportStatus;
import com.traffichq.backend.enums.ViolationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByUser_UserId(Long userId);

    List<Report> findByStatus(ReportStatus status);

    List<Report> findByLicensePlateAndViolationTypeAndStatusIn(
            String licensePlate,
            ViolationType violationType,
            List<ReportStatus> statuses
    );
}