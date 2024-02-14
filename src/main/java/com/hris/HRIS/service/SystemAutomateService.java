package com.hris.HRIS.service;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.ExitListModel;
import com.hris.HRIS.model.PromotionModel;
import com.hris.HRIS.model.TransferModel;
import com.hris.HRIS.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
}
