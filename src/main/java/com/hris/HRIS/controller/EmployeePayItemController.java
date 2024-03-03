package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeePayItemModel;
import com.hris.HRIS.model.PayItemModel;
import com.hris.HRIS.repository.EmployeePayItemRepository;
import com.hris.HRIS.service.PayrollModuleCalculationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @Autowired
    PayrollModuleCalculationService payrollModuleCalculationService;
    

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

                overtimePayments = payrollModuleCalculationService.calculateOvertimePayments(basicSalary, totalHoursAllowed, overtimeHoursWorked);

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

            lateMinuteDeductionAmount = payrollModuleCalculationService.calculateLateMinuteDeductions(basicSalary, totalHoursAllowed, lateMinutes);

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

                noPayHoursDeductionAmount = payrollModuleCalculationService.calculateNoPayHoursDeductions(basicSalary, totalHoursAllowed, noPayHours);

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

    @PostMapping("{email}/EPFdeductions")
    public ResponseEntity<ApiResponse> addEPFDeductions(@PathVariable String email) {

        String returnMsg;

        Map<String, Double> payitemNamesList = new HashMap<>();
        payitemNamesList.put("E.P.F. 10.0%", 10.00);
        payitemNamesList.put("E.P.F. 15.0%", 15.00);

        try{
            for(Map.Entry<String, Double> payitemNameEntry : payitemNamesList.entrySet()){

                String payitemName = payitemNameEntry.getKey();

                List<EmployeePayItemModel> employeePayItemsList = employeePayItemRepository.findAllByEmail(email);

                Double basicSalary = employeePayItemsList.get(0).getAmount(); // First payitem is the basic.
                Double EPFDeductionAmount = 0.0;

                EPFDeductionAmount = payrollModuleCalculationService.calculateEPF(basicSalary, payitemNameEntry.getValue());

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
                employeePayItemModel.setAmount(EPFDeductionAmount);

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
            }

            returnMsg = "EPF deductions updated successfully.";

        }catch(Exception e){
            returnMsg = "Failed to process the received parameters.";
        }

        ApiResponse apiResponse = new ApiResponse(returnMsg);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("{email}/ETFdeductions")
    public ResponseEntity<ApiResponse> addETFDeductions(@PathVariable String email) {

        String returnMsg;

        try{

            String payitemName = "E.T.F. 3.0%";

            List<EmployeePayItemModel> employeePayItemsList = employeePayItemRepository.findAllByEmail(email);

            Double basicSalary = employeePayItemsList.get(0).getAmount(); // First payitem is the basic.
            Double EPFDeductionAmount = 0.0;

            EPFDeductionAmount = payrollModuleCalculationService.calculateEPF(basicSalary, 3.0);

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
            employeePayItemModel.setAmount(EPFDeductionAmount);

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

            returnMsg = "ETF deductions updated successfully.";

        }catch(Exception e){
            returnMsg = "Failed to process the received parameters.";
        }

        ApiResponse apiResponse = new ApiResponse(returnMsg);
        return ResponseEntity.ok(apiResponse);
    }
}