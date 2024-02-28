package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.PayItemModel;
import com.hris.HRIS.model.PayrollReportModel;
import com.hris.HRIS.repository.PayrollReportRepository;
import com.hris.HRIS.service.PayrollReportsGenerationService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/get/all/email/{email}")
    public List<PayrollReportModel> getAllPayrollReportsByEmail(@PathVariable String email){

        List<PayrollReportModel> payrollReportsList = payrollReportRepository.findAllByEmail(email);
        
        Collections.reverse(payrollReportsList);

        return payrollReportsList;
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<PayrollReportModel> getPayrollReportsById(@PathVariable String id){

        Optional<PayrollReportModel> payrollReportModalOptional = payrollReportRepository.findById(id);

        return payrollReportModalOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{reportType}/latest/email/{email}")
    public PayrollReportModel getLatestPayrollReportByEmail(@PathVariable String email){

        List<PayrollReportModel> payrollReportsList = payrollReportRepository.findAllByEmail(email);

        PayrollReportModel payrollReportModal = payrollReportsList.get(payrollReportsList.size() - 1);

        return payrollReportModal;
    }
}
