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
import com.hris.HRIS.controller.TaxController;
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

    @Autowired
    TaxController taxController;

    public void generatePayrollReport(String reportType, String payPeriod, String email){
        List<EmployeePayItemModel> employeePayItemsList = employeePayItemController.getPayItemsByEmail(email);
        List<Context> payitems = new ArrayList<>();
        List<Context> deductions = new ArrayList<>();
        
        PayrollReportModel payrollReportModel = new PayrollReportModel();

        double amount = 0.0;
        double deductedAmount = 0.0;

        // Calculate earnings for the pay items.
        for(int i = 0; i < employeePayItemsList.size(); i++){
            PayItemModel payItemModel = payItemController.getPayItemById(employeePayItemsList.get(i).getPayItemId()).getBody();

            Context payitem = new Context();

            payitem.setVariable("itemName", payItemModel.getItemName());
            payitem.setVariable("description", payItemModel.getDescription());
            payitem.setVariable("amount", employeePayItemsList.get(i).getAmount());

            if(payItemModel.getItemType().equals("Deletion")){
                deductedAmount += employeePayItemsList.get(i).getAmount();
                deductions.add(payitem);
            }else{
                amount += employeePayItemsList.get(i).getAmount();
                payitems.add(payitem);
            }
            
        }

        double taxRate = Double.parseDouble(taxController.getTaxRateForSalary(amount - deductedAmount).getBody().getMessage());
        double totalTax = (amount - deductedAmount) * (taxRate/100);

        Context deduction = new Context();
        deduction.setVariable("itemName", "Tax");
        deduction.setVariable("amount", totalTax);
        deductions.add(deduction);

        deductedAmount += totalTax;

        payrollReportModel.setDeductions(deductions);

        payrollReportModel.setPayItems(payitems);
        payrollReportModel.setTotalEarnings(amount);
        payrollReportModel.setTotalDeductions(deductedAmount);
        payrollReportModel.setNetPay(amount - deductedAmount);
        payrollReportModel.setEmail(email);
        payrollReportModel.setPayPeriod(payPeriod);
        payrollReportModel.setReportType(reportType);
        payrollReportModel.setStatus("Pending approval");

        String generatedDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        payrollReportModel.setReportGeneratedDate(generatedDateTime);

        payrollReportRepository.save(payrollReportModel);
    }
}