package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeePayItemModel;
import com.hris.HRIS.repository.EmployeePayItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employee/payitems")
public class EmployeePayItemController {
    @Autowired
    EmployeePayItemRepository employeePayItemRepository;

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse> assignPayItem(@RequestBody EmployeePayItemModel employeePayItemModel) {
        employeePayItemRepository.save(employeePayItemModel);

        ApiResponse apiResponse = new ApiResponse("Pay item assigned successfully to " + employeePayItemModel.getEmail() + ".");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/{email}")
    public List<EmployeePayItemModel> getPayItemsByEmail(@PathVariable String email){

        List<EmployeePayItemModel> employeePayItemsList = employeePayItemRepository.findAllByEmail(email);
        
        return employeePayItemsList;
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> removePayItemFromEmployee(@PathVariable String id){
        employeePayItemRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Pay item removed from the employee successfully");
        return ResponseEntity.ok(apiResponse);
    }
}