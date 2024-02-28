package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.CourseModel;
import com.hris.HRIS.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/lms/course")
public class CourseController {
    @Autowired
    CourseRepository courseRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> createCourse(@RequestBody CourseModel courseModel) {
        courseModel.setCourseCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        courseRepository.save(courseModel);

        ApiResponse apiResponse = new ApiResponse("Course created successfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<CourseModel> getAllCourses(){
        return courseRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<CourseModel> getCourseById(@PathVariable String id){
        Optional<CourseModel> courseModelOptional = courseRepository.findById(id);

        return courseModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateCourse(@PathVariable String id, @RequestBody CourseModel courseModel){
        Optional<CourseModel> courseModelOptional = courseRepository.findById(id);

        if(courseModelOptional.isPresent()){
            CourseModel existingCourse = courseModelOptional.get();
            existingCourse.setCourseCode(courseModel.getCourseCode());
            existingCourse.setCourseName(courseModel.getCourseName());
            existingCourse.setCourseDescription(courseModel.getCourseDescription());
            existingCourse.setEnrollmentLimit(courseModel.getEnrollmentLimit());
            existingCourse.setGradingScale(courseModel.getGradingScale());
            existingCourse.setStartDate(courseModel.getStartDate());
            existingCourse.setEndDate(courseModel.getEndDate());
            existingCourse.setStatus(courseModel.getStatus());

            courseRepository.save(existingCourse);
        }

        ApiResponse apiResponse = new ApiResponse("Course details updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("update/status/id/{id}")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable String id, @RequestBody CourseModel courseModel){
        Optional<CourseModel> courseModelOptional = courseRepository.findById(id);

        if(courseModelOptional.isPresent()){
            CourseModel existingCourse = courseModelOptional.get();
            existingCourse.setStatus(courseModel.getStatus());

            courseRepository.save(existingCourse);
        }

        ApiResponse apiResponse = new ApiResponse("Course status updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteCourse(@PathVariable String id){
        courseRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Course deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
