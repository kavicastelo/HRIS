package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.PayItemModel;
import com.hris.HRIS.model.TaxModel;
import com.hris.HRIS.repository.EmployeeRepository;
import com.hris.HRIS.repository.TaxRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/tax")
public class TaxController {
    @Autowired
    TaxRepository taxRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveTaxInfo(@RequestBody TaxModel taxModel) {
        taxRepository.save(taxModel);

        ApiResponse apiResponse = new ApiResponse("tax rates added successfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<TaxModel> getAllTaxRates(){
        return taxRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<TaxModel> getTaxInfoById(@PathVariable String id){
        Optional<TaxModel> taxModelOptional = taxRepository.findById(id);

        return taxModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/salary/{amount}")
    public ResponseEntity<ApiResponse> getTaxRateForSalary(@PathVariable double amount) {
        List<TaxModel> taxRates  = getAllTaxRates();
        double taxRate = 0.0;
        
        for(int i = 0; i < taxRates.size(); i++){
            if (amount >= taxRates.get(i).getMin() & amount <= taxRates.get(i).getMax()){
                taxRate = taxRates.get(i).getRate();
                break;
            }
        }

        ApiResponse apiResponse = new ApiResponse(Double.toString(taxRate));
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateTaxInfo(@PathVariable String id, @RequestBody TaxModel taxModel){
        Optional<TaxModel> taxModelOptional = taxRepository.findById(id);

        if(taxModelOptional.isPresent()){
            TaxModel existingTaxInfo = taxModelOptional.get();
            existingTaxInfo.setMin(taxModel.getMin());
            existingTaxInfo.setMax(taxModel.getMax());
            existingTaxInfo.setRate(taxModel.getRate());

            taxRepository.save(existingTaxInfo);
        }

        ApiResponse apiResponse = new ApiResponse("Tax information updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteTaxInfo(@PathVariable String id){
        taxRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Tax info removed successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
