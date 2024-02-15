package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.repository.PayrollReportRepository;
import com.hris.HRIS.service.PayrollReportsGenerationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/payrollreport")
public class PayrollReportController {
    @Autowired
    PayrollReportRepository payrollReportRepository;

    @Autowired
    PayrollReportsGenerationService payrollReportsGenerationService;

    @PostMapping("/{reportType}/{payPeriod}/generate/{email}")
    public ResponseEntity<ApiResponse> generatePayrollReport(@PathVariable String reportType, @PathVariable String payPeriod, @PathVariable String email) {
        
        payrollReportsGenerationService.generatePayrollReport(reportType, payPeriod, email);

        ApiResponse apiResponse = new ApiResponse("Report generated successfuly.");
        return ResponseEntity.ok(apiResponse);
    }
}
