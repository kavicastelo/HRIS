package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeePayItemModel;
import com.hris.HRIS.model.PayItemModel;
import com.hris.HRIS.repository.EmployeePayItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/v1/employee/payitems")
public class EmployeePayItemController {
    @Autowired
    EmployeePayItemRepository employeePayItemRepository;

    @Autowired
    PayItemController payItemController;

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

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateEmployeePayItem(@PathVariable String id, @RequestBody EmployeePayItemModel employeePayItemModel){
        Optional<EmployeePayItemModel> employeePayItemModelOptional = employeePayItemRepository.findById(id);

        if(employeePayItemModelOptional.isPresent()){
            EmployeePayItemModel existingEmployeePayItem = employeePayItemModelOptional.get();
            existingEmployeePayItem.setPayItemId(employeePayItemModel.getPayItemId());
            existingEmployeePayItem.setEmail(employeePayItemModel.getEmail());
            existingEmployeePayItem.setAmount(employeePayItemModel.getAmount());

            employeePayItemRepository.save(existingEmployeePayItem);
        }

        ApiResponse apiResponse = new ApiResponse("Pay item of the employee " + employeePayItemModel.getEmail() + " updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> removePayItemFromEmployee(@PathVariable String id){
        employeePayItemRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Pay item removed from the employee successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("{email}/overtime-payment")
    public ResponseEntity<ApiResponse> addOvertimePayments(@PathVariable String email, @RequestBody String requestBody) {
        
        ObjectMapper objectMapper = new ObjectMapper();
        String returnMsg;

        try {
            JsonNode requestBodyJson = objectMapper.readTree(requestBody);

            double totalHoursAllowed = requestBodyJson.get("totalHoursAllowed").asDouble();
            double overtimeHoursWorked = requestBodyJson.get("overtimeHoursWorked").asDouble();

            List<EmployeePayItemModel> employeePayItemsList = employeePayItemRepository.findAllByEmail(email);

            Double basicSalary = employeePayItemsList.get(0).getAmount(); // First payitem is the basic.
            Double overtimePayments = 0.0;

            String payitemName = "Overtime payment";

            if(overtimeHoursWorked <= totalHoursAllowed){
                Double overtimePaymentsPerHour = basicSalary/totalHoursAllowed;

                // overtimePayments = overtimeHoursWorked * (overtimePaymentsPerHour + overtimePaymentsPerHour/2);
                overtimePayments = overtimeHoursWorked * overtimePaymentsPerHour;

                ResponseEntity<PayItemModel> payItemModalOptional = payItemController.getPayItemByName(payitemName);

                if(!payItemModalOptional.hasBody()){
                    PayItemModel payItemModel = new PayItemModel();

                    payItemModel.setItemName(payitemName);
                    payItemModel.setDescription("");
                    payItemModel.setItemType("Addition");
                    payItemModel.setPaymentType("Variable");
                    payItemModel.setStatus("Available");

                    payItemController.savePayItem(payItemModel);
                }

                EmployeePayItemModel employeePayItemModel = new EmployeePayItemModel();

                employeePayItemModel.setPayItemId(payItemController.getPayItemByName(payitemName).getBody().getId());
                employeePayItemModel.setEmail(email);
                employeePayItemModel.setAmount(overtimePayments);

                boolean isOvertimePayItemFound = false;

                for(int i = 0; i < employeePayItemsList.size(); i++){
                    if(payItemController.getPayItemById(employeePayItemsList.get(i).getPayItemId()).getBody().getItemName().equals(payitemName)){
                        isOvertimePayItemFound = true;
                        updateEmployeePayItem(employeePayItemsList.get(i).getId(), employeePayItemModel);
                        break;
                    }
                }

                if(!isOvertimePayItemFound){
                    assignPayItem(employeePayItemModel);
                }

                returnMsg = "Overtime payments updated successfully.";
            }else{
                returnMsg = "Worked hours are out of range.";
            }

        } catch (Exception e) {
            
            returnMsg = "Failed to process the received parameters.";
        }

        ApiResponse apiResponse = new ApiResponse(returnMsg);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("{email}/late-min-deduction")
    public ResponseEntity<ApiResponse> addLateMinuteDeductions(@PathVariable String email, @RequestBody String requestBody) {

        ObjectMapper objectMapper = new ObjectMapper();
        String returnMsg;

        try {
            JsonNode requestBodyJson = objectMapper.readTree(requestBody);

            double totalHoursAllowed = requestBodyJson.get("totalHoursAllowed").asDouble();
            double lateMinutes = requestBodyJson.get("lateMinutes").asDouble();
        
            String payitemName = "Late minute deductions";

            List<EmployeePayItemModel> employeePayItemsList = employeePayItemRepository.findAllByEmail(email);

            Double basicSalary = employeePayItemsList.get(0).getAmount(); // First payitem is the basic.
            Double lateMinuteDeductionAmount = 0.0;

            Double deductionAmountPerHour = basicSalary/totalHoursAllowed;

            lateMinuteDeductionAmount = (lateMinutes/60) * deductionAmountPerHour;

            ResponseEntity<PayItemModel> payItemModalOptional = payItemController.getPayItemByName(payitemName);

            if(!payItemModalOptional.hasBody()){
                PayItemModel payItemModel = new PayItemModel();

                payItemModel.setItemName(payitemName);
                payItemModel.setDescription("");
                payItemModel.setItemType("Deletion");
                payItemModel.setPaymentType("Variable");
                payItemModel.setStatus("Available");

                payItemController.savePayItem(payItemModel);
            }

            EmployeePayItemModel employeePayItemModel = new EmployeePayItemModel();

            employeePayItemModel.setPayItemId(payItemController.getPayItemByName(payitemName).getBody().getId());
            employeePayItemModel.setEmail(email);
            employeePayItemModel.setAmount(lateMinuteDeductionAmount);

            boolean isPayItemFound = false;

            for(int i = 0; i < employeePayItemsList.size(); i++){
                if(payItemController.getPayItemById(employeePayItemsList.get(i).getPayItemId()).getBody().getItemName().equals(payitemName)){
                    isPayItemFound = true;
                    updateEmployeePayItem(employeePayItemsList.get(i).getId(), employeePayItemModel);
                    break;
                }
            }

            if(!isPayItemFound){
                assignPayItem(employeePayItemModel);
            }

            returnMsg = "Late minute deductions updated successfully.";
        

        } catch (Exception e) {
            
            returnMsg = "Failed to process the received parameters.";
        }

        ApiResponse apiResponse = new ApiResponse(returnMsg);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("{email}/nopay-hours-deduction")
    public ResponseEntity<ApiResponse> addNoPayHoursDeductions(@PathVariable String email, @RequestBody String requestBody) {

        ObjectMapper objectMapper = new ObjectMapper();
        String returnMsg;

        try {
            JsonNode requestBodyJson = objectMapper.readTree(requestBody);

            double totalHoursAllowed = requestBodyJson.get("totalHoursAllowed").asDouble();
            double noPayHours = requestBodyJson.get("noPayHours").asDouble();

            String payitemName = "No pay hours";
        

            List<EmployeePayItemModel> employeePayItemsList = employeePayItemRepository.findAllByEmail(email);

            Double basicSalary = employeePayItemsList.get(0).getAmount(); // First payitem is the basic.
            Double noPayHoursDeductionAmount = 0.0;

            if(noPayHours <= totalHoursAllowed){

                noPayHoursDeductionAmount = (noPayHours/totalHoursAllowed) * basicSalary;

                ResponseEntity<PayItemModel> payItemModalOptional = payItemController.getPayItemByName(payitemName);

                if(!payItemModalOptional.hasBody()){
                    PayItemModel payItemModel = new PayItemModel();

                    payItemModel.setItemName(payitemName);
                    payItemModel.setDescription("");
                    payItemModel.setItemType("Deletion");
                    payItemModel.setPaymentType("Variable");
                    payItemModel.setStatus("Available");

                    payItemController.savePayItem(payItemModel);
                }

                EmployeePayItemModel employeePayItemModel = new EmployeePayItemModel();

                employeePayItemModel.setPayItemId(payItemController.getPayItemByName(payitemName).getBody().getId());
                employeePayItemModel.setEmail(email);
                employeePayItemModel.setAmount(noPayHoursDeductionAmount);

                boolean isPayItemFound = false;

                for(int i = 0; i < employeePayItemsList.size(); i++){
                    if(payItemController.getPayItemById(employeePayItemsList.get(i).getPayItemId()).getBody().getItemName().equals(payitemName)){
                        isPayItemFound = true;
                        updateEmployeePayItem(employeePayItemsList.get(i).getId(), employeePayItemModel);
                        break;
                    }
                }

                if(!isPayItemFound){
                    assignPayItem(employeePayItemModel);
                }

                returnMsg = "No pay hours deductions updated successfully.";

            }else{
                returnMsg = "No pay hours are out of range.";
            }
        

        } catch (Exception e) {
            
            returnMsg = "Failed to process the received parameters.";
        }

        ApiResponse apiResponse = new ApiResponse(returnMsg);
        return ResponseEntity.ok(apiResponse);
    }
}