package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.repository.EmployeeRepository;
import com.hris.HRIS.service.SystemAutomateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {
    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    SystemAutomateService systemAutomateService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveEmployee(@RequestBody EmployeeModel employeeModel){
        employeeRepository.save(employeeModel);

        systemAutomateService.updateOrganizationEmployees(employeeModel);

        ApiResponse apiResponse = new ApiResponse("Employee saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<EmployeeModel> getAllEmployees(){
        return employeeRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<EmployeeModel> getEmployeeById(@PathVariable String id){
        Optional<EmployeeModel> employeeModelOptional = employeeRepository.findById(id);

        return employeeModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<EmployeeModel> getEmployeeByEmail(@PathVariable String email){
        Optional<EmployeeModel> employeeModelOptional = employeeRepository.findOneByEmail(email);

        return employeeModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateEmployee(@PathVariable String id, @RequestBody EmployeeModel employeeModel){
        systemAutomateService.updateEmployeeAndUpdateOrganization(id, employeeModel);

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/email/{email}")
    public ResponseEntity<ApiResponse> updateEmployeeByEmail(@PathVariable String email, @RequestBody EmployeeModel employeeModel){
        systemAutomateService.updateEmployeeAndUpdateOrganizationByEmail(email, employeeModel);

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable String id){
        systemAutomateService.deleteEmployeeAndUpdateOrganization(id);

        ApiResponse apiResponse = new ApiResponse("Employee deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/email/{email}")
    public ResponseEntity<ApiResponse> deleteEmployeeByEmail(@PathVariable String email){
        systemAutomateService.deleteEmployeeAndUpdateOrganizationByEmail(email);

        ApiResponse apiResponse = new ApiResponse("Employee deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
