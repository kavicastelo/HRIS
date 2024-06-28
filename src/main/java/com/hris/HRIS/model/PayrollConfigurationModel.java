package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "payroll-configuration")
public class PayrollConfigurationModel {
    @Id
    private String id;
    private String organizationId;
    private String payrollFrequency;
    private String payrollPeriodStartDate;
    private String payrollPeriodEndDate;
    private String deadlineToRunPayroll;
    private String payDay; // The day where thr employees receives the payments + payslip.
}
