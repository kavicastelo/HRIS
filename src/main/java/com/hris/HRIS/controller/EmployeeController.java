package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.repository.EmployeeRepository;
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

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveEmployee(@RequestBody EmployeeModel employeeModel){
        employeeRepository.save(employeeModel);

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
        Optional<EmployeeModel> employeeModelOptional = employeeRepository.findById(id);

        if(employeeModelOptional.isPresent()){
            EmployeeModel existingEmployee = employeeModelOptional.get();
            existingEmployee.setName(employeeModel.getName());
            existingEmployee.setEmail(employeeModel.getEmail());
            existingEmployee.setPhone(employeeModel.getPhone());
            existingEmployee.setAddress(employeeModel.getAddress());
            existingEmployee.setJobData(employeeModel.getJobData());
            existingEmployee.setGender(employeeModel.getGender());
            existingEmployee.setDob(employeeModel.getDob());
            existingEmployee.setPhoto(employeeModel.getPhoto());
            existingEmployee.setPassword(employeeModel.getPassword());
            existingEmployee.setStatus(employeeModel.getStatus());
            existingEmployee.setLevel(employeeModel.getLevel());
            existingEmployee.setToken(employeeModel.getToken());
            existingEmployee.setRefreshToken(employeeModel.getRefreshToken());
            existingEmployee.setOtp(employeeModel.getOtp());
            existingEmployee.setOtpExpiry(employeeModel.getOtpExpiry());
        }

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/email/{email}")
    public ResponseEntity<ApiResponse> updateEmployeeByEmail(@PathVariable String email, @RequestBody EmployeeModel employeeModel){
        Optional<EmployeeModel> employeeModelOptional = employeeRepository.findOneByEmail(email);

        if(employeeModelOptional.isPresent()){
            EmployeeModel existingEmployee = employeeModelOptional.get();
            existingEmployee.setName(employeeModel.getName());
            existingEmployee.setEmail(employeeModel.getEmail());
            existingEmployee.setPhone(employeeModel.getPhone());
            existingEmployee.setAddress(employeeModel.getAddress());
            existingEmployee.setJobData(employeeModel.getJobData());
            existingEmployee.setGender(employeeModel.getGender());
            existingEmployee.setDob(employeeModel.getDob());
            existingEmployee.setPhoto(employeeModel.getPhoto());
            existingEmployee.setPassword(employeeModel.getPassword());
            existingEmployee.setStatus(employeeModel.getStatus());
            existingEmployee.setLevel(employeeModel.getLevel());
            existingEmployee.setToken(employeeModel.getToken());
            existingEmployee.setRefreshToken(employeeModel.getRefreshToken());
            existingEmployee.setOtp(employeeModel.getOtp());
            existingEmployee.setOtpExpiry(employeeModel.getOtpExpiry());
        }

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable String id){
        employeeRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Employee deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/email/{email}")
    public ResponseEntity<ApiResponse> deleteEmployeeByEmail(@PathVariable String email){
        employeeRepository.deleteByEmail(email);

        ApiResponse apiResponse = new ApiResponse("Employee deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
