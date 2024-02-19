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

    @PostMapping("{email}/overtime-payment/{totalHoursAllowed}/{overtimeHoursWorked}")
    public ResponseEntity<ApiResponse> addOvertimePayments(@PathVariable String email, @PathVariable double totalHoursAllowed, @PathVariable double overtimeHoursWorked) {
        
        List<EmployeePayItemModel> employeePayItemsList = employeePayItemRepository.findAllByEmail(email);

        Double basicSalary = employeePayItemsList.get(0).getAmount(); // First payitem is the basic.
        Double overtimePayments = 0.0;

        String returnMsg;

        if(overtimeHoursWorked <= totalHoursAllowed){
            Double overtimePaymentsPerHour = basicSalary/totalHoursAllowed;

            // overtimePayments = overtimeHoursWorked * (overtimePaymentsPerHour + overtimePaymentsPerHour/2);
            overtimePayments = overtimeHoursWorked * overtimePaymentsPerHour;

            ResponseEntity<PayItemModel> payItemModalOptional = payItemController.getPayItemByName("Overtime payment");

            if(!payItemModalOptional.hasBody()){
                PayItemModel payItemModel = new PayItemModel();

                payItemModel.setItemName("Overtime payment");
                payItemModel.setDescription("");
                payItemModel.setItemType("Addition");
                payItemModel.setPaymentType("Variable");
                payItemModel.setStatus("Available");

                payItemController.savePayItem(payItemModel);
            }

            EmployeePayItemModel employeePayItemModel = new EmployeePayItemModel();

            employeePayItemModel.setPayItemId(payItemController.getPayItemByName("Overtime payment").getBody().getId());
            employeePayItemModel.setEmail(email);
            employeePayItemModel.setAmount(overtimePayments);

            boolean isOvertimePayItemFound = false;

            for(int i = 0; i < employeePayItemsList.size(); i++){
                if(payItemController.getPayItemById(employeePayItemsList.get(i).getPayItemId()).getBody().getItemName().equals("Overtime payment")){
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

        ApiResponse apiResponse = new ApiResponse(returnMsg);
        return ResponseEntity.ok(apiResponse);
    }
}