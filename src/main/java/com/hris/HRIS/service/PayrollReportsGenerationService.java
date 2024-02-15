package com.hris.HRIS.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.hris.HRIS.controller.EmployeePayItemController;
import com.hris.HRIS.controller.PayItemController;
import com.hris.HRIS.model.EmployeePayItemModel;
import com.hris.HRIS.model.PayItemModel;
import com.hris.HRIS.model.PayrollReportModel;
import com.hris.HRIS.repository.PayrollReportRepository;

@Service
public class PayrollReportsGenerationService {

    @Autowired
    EmployeePayItemController employeePayItemController;

    @Autowired
    PayItemController payItemController;

    @Autowired
    PayrollReportRepository payrollReportRepository;

    public void generatePayrollReport(String reportType, String payPeriod, String email){
        List<EmployeePayItemModel> employeePayItemsList = employeePayItemController.getPayItemsByEmail(email);
        List<Context> payitems = new ArrayList<>();
        
        PayrollReportModel payrollReportModel = new PayrollReportModel();

        double amount = 0.0;
        double deductedAmount = 0.0;

        for(int i = 0; i < employeePayItemsList.size(); i++){
            PayItemModel payItemModel = payItemController.getPayItemById(employeePayItemsList.get(i).getPayItemId()).getBody();
            System.out.println(payItemModel.getItemName());

            Context payitem = new Context();

            payitem.setVariable("itemName", payItemModel.getItemName());
            payitem.setVariable("description", payItemModel.getDescription());
            payitem.setVariable("amount", employeePayItemsList.get(i).getAmount());

            amount += employeePayItemsList.get(i).getAmount();

            payitems.add(payitem);
        }

        payrollReportModel.setPayItems(payitems);
        payrollReportModel.setTotalEarnings(amount);
        payrollReportModel.setTotalDeductions(deductedAmount);
        payrollReportModel.setNetPay(amount - deductedAmount);
        payrollReportModel.setEmail(email);
        payrollReportModel.setPayPeriod(payPeriod);
        payrollReportModel.setReportType(reportType);

        String generatedDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        payrollReportModel.setReportGeneratedDate(generatedDateTime);

        payrollReportRepository.save(payrollReportModel);
    }

}
