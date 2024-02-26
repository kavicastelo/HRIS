package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.OrganizationModel;
import com.hris.HRIS.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/organization")
public class OrganizationController {
    @Autowired
    OrganizationRepository organizationRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveOrganization(@RequestBody OrganizationModel organizationModel){
        organizationRepository.save(organizationModel);

        ApiResponse apiResponse = new ApiResponse("Organization saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<OrganizationModel> getAllOrganization(){
        return organizationRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<OrganizationModel> getOrganizationById(String id){
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findById(id);

        return organizationModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<OrganizationModel> getOrganizationByEmail(String email){
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findByEmail(email);

        return organizationModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateOrganization(@PathVariable String id, @RequestBody OrganizationModel organizationModel){
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findById(id);

        if(organizationModelOptional.isPresent()){
            OrganizationModel existingOrganization = organizationModelOptional.get();
            existingOrganization.setOrganizationName(organizationModel.getOrganizationName());
            existingOrganization.setContactPerson(organizationModel.getContactPerson());
            existingOrganization.setEmail(organizationModel.getEmail());
            existingOrganization.setAddress(organizationModel.getAddress());
            existingOrganization.setPhone(organizationModel.getPhone());
            organizationRepository.save(existingOrganization);

            ApiResponse apiResponse = new ApiResponse("Organization updated successfully");
            return ResponseEntity.ok(apiResponse);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteOrganization(@PathVariable String id){
        organizationRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Organization deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
