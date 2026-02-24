package com.traffichq.backend.dto.report;

import com.traffichq.backend.enums.ReportStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportStatusUpdateRequest {
    private ReportStatus status;
}