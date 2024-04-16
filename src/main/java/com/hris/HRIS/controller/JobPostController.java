package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.JobPostModel;
import com.hris.HRIS.repository.JobPostRepository;
import com.hris.HRIS.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/jobPost")
public class JobPostController {

    @Autowired
    JobPostRepository jobPostRepository;

    @Autowired
    JobPostService jobPostService;

    //save details
    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveJobPost(JobPostModel jobPostModel){

        //check all fields fill or empty
        if(jobPostModel == null || jobPostModel.getAbout_job() == null || jobPostModel.getAbout_job().isEmpty() ||
                jobPostModel.getDescription() == null || jobPostModel.getDescription().isEmpty() ||
                jobPostModel.getCaption() == null || jobPostModel.getCaption().isEmpty() ||
                jobPostModel.getEnd_date() == null || jobPostModel.getEnd_date().isEmpty() ||
                jobPostModel.getContact_email() == null || jobPostModel.getContact_email().isEmpty() ||
                jobPostModel.getResponsibilities() == null || jobPostModel.getResponsibilities().isEmpty() ||
                jobPostModel.getEducation_requirements() == null || jobPostModel.getEducation_requirements().isEmpty() ||
                jobPostModel.getExperience_level() == null || jobPostModel.getExperience_level().isEmpty() ||
                jobPostModel.getTechnical_requirements() == null || jobPostModel.getTechnical_requirements().isEmpty()) {

            ApiResponse apiResponse = new ApiResponse("Please fill all the Fields");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }

        else if(!jobPostService.isValidEmail(jobPostModel.getContact_email())){

            ApiResponse apiResponse = new ApiResponse("Please give valid email");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }

        jobPostRepository.save(jobPostModel);

        ApiResponse apiResponse = new ApiResponse("Job Posted Successfully");
        return ResponseEntity.ok(apiResponse);
    }

    //get all details
    @GetMapping("/get/all")
    public List<JobPostModel> getAllJobPosts(){

        return jobPostRepository.findAll();
    }

    //update details by id
    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateJobPost(@PathVariable String id,@RequestBody JobPostModel jobPostModel){

        Optional<JobPostModel> jobPostModelOptional = jobPostRepository.findById(id);

        if(jobPostModelOptional.isPresent()){

            JobPostModel existingJobPost = jobPostModelOptional.get();
            existingJobPost.setCaption(jobPostModel.getCaption());
            existingJobPost.setAbout_job(jobPostModel.getAbout_job());
            existingJobPost.setTechnical_requirements(jobPostModel.getTechnical_requirements());
            existingJobPost.setEducation_requirements(jobPostModel.getEducation_requirements());
            existingJobPost.setResponsibilities(jobPostModel.getResponsibilities());
            existingJobPost.setExperience_level(jobPostModel.getExperience_level());
            existingJobPost.setEnd_date(jobPostModel.getEnd_date());
            existingJobPost.setContact_email(jobPostModel.getContact_email());
            existingJobPost.setDescription(jobPostModel.getDescription());

            jobPostRepository.save(existingJobPost);
        }

        ApiResponse apiResponse = new ApiResponse("Details Updated Successfully");
        return ResponseEntity.ok(apiResponse);
    }

    //delete details by id
    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteJobPost(@PathVariable String id){

        jobPostRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Job Post Deleted Successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
