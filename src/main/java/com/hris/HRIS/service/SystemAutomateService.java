package com.hris.HRIS.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.ExitListModel;
import com.hris.HRIS.model.PromotionModel;
import com.hris.HRIS.model.TransferModel;
import com.hris.HRIS.repository.EmployeeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Map;
import java.util.Optional;

@Service
public class SystemAutomateService {

    @Autowired
    EmployeeRepository employeeRepository;

    public void UpdateEmployeeJobDataExit(ExitListModel exitListModel) {
        Optional<EmployeeModel> employee =  employeeRepository.findOneByEmail(exitListModel.getEmail());

        if (employee.isPresent()) {
            EmployeeModel existingEmployee = employee.get();
            existingEmployee.setJobData(exitListModel.getJobData());
            employeeRepository.save(existingEmployee);
        }
    }

    public void UpdateEmployeeJobDataPromotion(PromotionModel promotionModel){
        Optional<EmployeeModel> employee =  employeeRepository.findOneByEmail(promotionModel.getEmail());

        if (employee.isPresent()) {
            EmployeeModel existingEmployee = employee.get();
            existingEmployee.setJobData(promotionModel.getJobData());
            employeeRepository.save(existingEmployee);
        }
    }

    public void UpdateEmployeeJobDataTransfer(TransferModel transferModel){
        Optional<EmployeeModel> employee =  employeeRepository.findOneByEmail(transferModel.getEmail());

        if (employee.isPresent()) {
            EmployeeModel existingEmployee = employee.get();
            existingEmployee.setJobData(transferModel.getJobData());
            employeeRepository.save(existingEmployee);
        }
    }

    public Float CalculateGratuity(ExitListModel exitListModel) {
        String date1 = exitListModel.getDoj();
        String date2 = exitListModel.getDoe();

        LocalDate localDate1 = LocalDate.parse(date1);
        LocalDate localDate2 = LocalDate.parse(date2);

        Period period = Period.between(localDate1, localDate2);
        int years = period.getYears();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jobDataMap = objectMapper.convertValue(exitListModel.getJobData(), Map.class);
        Object salaryObject = jobDataMap.get("salary");

        float baseSalary = Float.parseFloat(salaryObject.toString());

//        Gratuity Formula: Gratuity (G) = n*b*15/26

        return years * baseSalary * 15 / 26;
    }
}
