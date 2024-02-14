package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.TransferModel;
import com.hris.HRIS.repository.TransferRepository;
import com.hris.HRIS.service.EmailService;
import com.hris.HRIS.service.LettersGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/transfer")
public class TransferController {
    String approvedLetter;

    @Autowired
    TransferRepository transferRepository;

    @Autowired
    LettersGenerationService lettersGenerationService;

    @Autowired
    EmailService emailService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveLetter(@RequestBody TransferModel transferModel) {
        transferRepository.save(transferModel);

        String receivedLetter = lettersGenerationService.generateReceivedTransferLetter(transferModel);
        emailService.sendSimpleEmail(transferModel.getEmail(), "Transfer Request", "We received your transfer request. Please find your letter in platform.\n\nBest Regards,\nHR Department");

        ApiResponse apiResponse = new ApiResponse(receivedLetter);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<TransferModel> getAllLetters() {
        return transferRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<TransferModel> getLetterById(@PathVariable String id) {
        Optional<TransferModel> transferModelOptional = transferRepository.findById(id);

        return transferModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<TransferModel> getLetterByEmail(@PathVariable String email) {
        Optional<TransferModel> transferModelOptional = transferRepository.findByEmail(email);

        return transferModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteLetter(@PathVariable String id) {
        transferRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Request deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/email/{email}")
    public ResponseEntity<ApiResponse> deleteLetterByEmail(@PathVariable String email) {
        transferRepository.deleteByEmail(email);

        ApiResponse apiResponse = new ApiResponse("Request deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateLetter(@PathVariable String id, @RequestBody TransferModel transferModel) {
        Optional<TransferModel> transferModelOptional = transferRepository.findById(id);

        if (transferModelOptional.isPresent()) {
            TransferModel existingLetter = transferModelOptional.get();
            existingLetter.setName(transferModel.getName());
            existingLetter.setEmail(transferModel.getEmail());
            existingLetter.setPhone(transferModel.getPhone());
            existingLetter.setAddress(transferModel.getAddress());
            existingLetter.setJobData(transferModel.getJobData());
            existingLetter.setDate(transferModel.getDate());
            existingLetter.setDoj(transferModel.getDoj());
            existingLetter.setPhoto(transferModel.getPhoto());
            existingLetter.setReason(transferModel.getReason());
            existingLetter.setApproved(transferModel.getApproved());

            transferRepository.save(existingLetter);
        }

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/email/{email}")
    public ResponseEntity<ApiResponse> updateLetterByEmail(@PathVariable String email, @RequestBody TransferModel transferModel) {
        Optional<TransferModel> transferModelOptional = transferRepository.findByEmail(email);

        if (transferModelOptional.isPresent()) {
            TransferModel existingLetter = transferModelOptional.get();
            existingLetter.setName(transferModel.getName());
            existingLetter.setEmail(transferModel.getEmail());
            existingLetter.setPhone(transferModel.getPhone());
            existingLetter.setAddress(transferModel.getAddress());
            existingLetter.setJobData(transferModel.getJobData());
            existingLetter.setDate(transferModel.getDate());
            existingLetter.setDoj(transferModel.getDoj());
            existingLetter.setPhoto(transferModel.getPhoto());
            existingLetter.setReason(transferModel.getReason());
            existingLetter.setApproved(transferModel.getApproved());

            transferRepository.save(existingLetter);
        }

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/approve/id/{id}")
    public ResponseEntity<ApiResponse> approveLetter(@PathVariable String id) {
        Optional<TransferModel> transferModelOptional = transferRepository.findById(id);

        if (transferModelOptional.isPresent()) {
            TransferModel existingLetter = transferModelOptional.get();
            existingLetter.setApproved(true);

            transferRepository.save(existingLetter);
            approvedLetter = lettersGenerationService.generateApprovedTransferLetter(existingLetter);
            emailService.sendSimpleEmail(existingLetter.getEmail(), "Transfer Request", "Congratulations!\nWe approved your transfer request. Please find your letter in platform.\n\nBest Regards,\nHR Department");
        }

        ApiResponse apiResponse = new ApiResponse(approvedLetter);
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/approve/email/{email}")
    public ResponseEntity<ApiResponse> approveLetterByEmail(@PathVariable String email) {
        Optional<TransferModel> transferModelOptional = transferRepository.findByEmail(email);

        if (transferModelOptional.isPresent()) {
            TransferModel existingLetter = transferModelOptional.get();
            existingLetter.setApproved(true);

            transferRepository.save(existingLetter);
            approvedLetter = lettersGenerationService.generateApprovedTransferLetter(existingLetter);
            emailService.sendSimpleEmail(existingLetter.getEmail(), "Transfer Request", "Congratulations!\nWe approved your transfer request. Please find your letter in platform.\n\nBest Regards,\nHR Department");
        }

        ApiResponse apiResponse = new ApiResponse(approvedLetter);
        return ResponseEntity.ok(apiResponse);
    }
}
