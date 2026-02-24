package com.traffichq.backend.entity;

import com.traffichq.backend.enums.ReportStatus;
import com.traffichq.backend.enums.ViolationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "license_plate", nullable = false, length = 20)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "violation_type", nullable = false)
    private ViolationType violationType;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "location_address", nullable = false, length = 255)
    private String locationAddress;

    @Column(name = "location_latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal locationLatitude;

    @Column(name = "location_longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal locationLongitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false)
    private ReportStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}