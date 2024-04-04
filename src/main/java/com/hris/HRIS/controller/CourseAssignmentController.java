package com.hris.HRIS.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.CourseAssignmentModel;
import com.hris.HRIS.repository.CourseAssignmentRepository;

@RestController
@RequestMapping("/api/v1/lms/course/assignment")
public class CourseAssignmentController {
    
    @Autowired
    CourseAssignmentRepository courseAssignmentRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveAssignment(@RequestBody CourseAssignmentModel courseAssignmentModel) {
        courseAssignmentModel.setCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        courseAssignmentRepository.save(courseAssignmentModel);

        ApiResponse apiResponse = new ApiResponse("Assignment saved successfully.");
        return ResponseEntity.ok(apiResponse);
    }

    // TODO: Upload files related to the assignments (assignment instructions, etc...).
    // TODO: Assignment marking rubric.

    @GetMapping("/get/id/{id}")
    public ResponseEntity<CourseAssignmentModel> getAssignmentById(@PathVariable String id){
        Optional<CourseAssignmentModel> courseAssignmentModelOptional = courseAssignmentRepository.findById(id);

        return courseAssignmentModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/all/moduleId/{moduleId}")
    public List<CourseAssignmentModel> getAllAssignmentsByModuleId(@PathVariable String moduleId){

        List<CourseAssignmentModel> quizesList = courseAssignmentRepository.findAllByModuleId(moduleId);

        return quizesList;
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateAssignment(@PathVariable String id, @RequestBody CourseAssignmentModel courseAssignmentModel){
        Optional<CourseAssignmentModel> courseAssignmentModelOptional = courseAssignmentRepository.findById(id);

        if(courseAssignmentModelOptional.isPresent()){
            CourseAssignmentModel existingCourseAssignment = courseAssignmentModelOptional.get();

            existingCourseAssignment.setModuleId(courseAssignmentModel.getModuleId());
            existingCourseAssignment.setAssignmentName(courseAssignmentModel.getAssignmentName());
            existingCourseAssignment.setAssignmentDescription(courseAssignmentModel.getAssignmentDescription());
            existingCourseAssignment.setNoOfAttempts(courseAssignmentModel.getNoOfAttempts());
            existingCourseAssignment.setMaximumGradeAllowed(courseAssignmentModel.getMaximumGradeAllowed());
            existingCourseAssignment.setStartDate(courseAssignmentModel.getStartDate());
            existingCourseAssignment.setEndDate(courseAssignmentModel.getEndDate());
            existingCourseAssignment.setStatus(courseAssignmentModel.getStatus());

            courseAssignmentRepository.save(existingCourseAssignment);
            
            ApiResponse apiResponse = new ApiResponse("Assignment updated successfully");
            return ResponseEntity.ok(apiResponse);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteAssignment(@PathVariable String id){
        Optional<CourseAssignmentModel> courseAssignmentModelOptional = courseAssignmentRepository.findById(id);

        if(courseAssignmentModelOptional.isPresent()){
            courseAssignmentRepository.deleteById(id);

            ApiResponse apiResponse = new ApiResponse("Assignment deleted successfully");
            return ResponseEntity.ok(apiResponse);
        }

        return ResponseEntity.notFound().build();
    }
}
