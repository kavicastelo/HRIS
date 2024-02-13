package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.PromotionModel;
import com.hris.HRIS.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/promotion")
public class PromotionController {

    @Autowired
    PromotionRepository promotionRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveLetter(@RequestBody PromotionModel promotionModel){
        promotionRepository.save(promotionModel);

        ApiResponse apiResponse = new ApiResponse("Promotion Letter Requested successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<PromotionModel> getAllLetters(){
        return promotionRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<PromotionModel> getLetterById(@PathVariable String id){
        Optional<PromotionModel> promotionModelOptional = promotionRepository.findById(id);

        return promotionModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<PromotionModel> getLetterByEmail(@PathVariable String email){
        Optional<PromotionModel> promotionModelOptional = promotionRepository.findByEmail(email);

        return promotionModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteLetter(@PathVariable String id){
        promotionRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Request deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/email/{email}")
    public ResponseEntity<ApiResponse> deleteLetterByEmail(@PathVariable String email){
        promotionRepository.deleteByEmail(email);

        ApiResponse apiResponse = new ApiResponse("Request deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateLetterById(@PathVariable String id, @RequestBody PromotionModel promotionModel){
        Optional<PromotionModel> promotionModelOptional = promotionRepository.findById(id);

        if(promotionModelOptional.isPresent()){
            PromotionModel existingLetter = promotionModelOptional.get();
            existingLetter.setName(promotionModel.getName());
            existingLetter.setEmail(promotionModel.getEmail());
            existingLetter.setPhone(promotionModel.getPhone());
            existingLetter.setAddress(promotionModel.getAddress());
            existingLetter.setJobData(promotionModel.getJobData());
            existingLetter.setDate(promotionModel.getDate());
            existingLetter.setDoj(promotionModel.getDoj());
            existingLetter.setPhoto(promotionModel.getPhoto());
            existingLetter.setReason(promotionModel.getReason());
            existingLetter.setApproved(promotionModel.getApproved());

            promotionRepository.save(existingLetter);
        }

        ApiResponse apiResponse = new ApiResponse("Employee approved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/email/{email}")
    public ResponseEntity<ApiResponse> updateLetterByEmail(@PathVariable String email, @RequestBody PromotionModel promotionModel){
        Optional<PromotionModel> promotionModelOptional = promotionRepository.findByEmail(email);

        if(promotionModelOptional.isPresent()){
            PromotionModel existingLetter = promotionModelOptional.get();
            existingLetter.setName(promotionModel.getName());
            existingLetter.setEmail(promotionModel.getEmail());
            existingLetter.setPhone(promotionModel.getPhone());
            existingLetter.setAddress(promotionModel.getAddress());
            existingLetter.setJobData(promotionModel.getJobData());
            existingLetter.setDate(promotionModel.getDate());
            existingLetter.setDoj(promotionModel.getDoj());
            existingLetter.setPhoto(promotionModel.getPhoto());
            existingLetter.setReason(promotionModel.getReason());
            existingLetter.setApproved(promotionModel.getApproved());

            promotionRepository.save(existingLetter);
        }

        ApiResponse apiResponse = new ApiResponse("Employee approved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/approve/email/{email}")
    public ResponseEntity<ApiResponse> approveLetterByEmail(@PathVariable String email){
        Optional<PromotionModel> promotionModelOptional = promotionRepository.findByEmail(email);

        if(promotionModelOptional.isPresent()){
            PromotionModel existingLetter = promotionModelOptional.get();
            existingLetter.setApproved(true);

            promotionRepository.save(existingLetter);
        }

        ApiResponse apiResponse = new ApiResponse("Employee approved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/approve/id/{id}")
    public ResponseEntity<ApiResponse> approveLetter(@PathVariable String id){
        Optional<PromotionModel> promotionModelOptional = promotionRepository.findById(id);

        if(promotionModelOptional.isPresent()){
            PromotionModel existingLetter = promotionModelOptional.get();
            existingLetter.setApproved(true);

            promotionRepository.save(existingLetter);
        }

        ApiResponse apiResponse = new ApiResponse("Employee approved successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
