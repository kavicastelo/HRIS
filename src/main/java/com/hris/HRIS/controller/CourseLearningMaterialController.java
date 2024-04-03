package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.CourseLearningMaterialModal;
import com.hris.HRIS.repository.CourseLearningMaterialRepository;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.mongodb.client.model.Filters.eq;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/v1/lms/course/module/course-learning-material")
public class CourseLearningMaterialController {

    @Autowired
    private MongoDatabaseFactory mongoDbFactory;
    
    @Autowired
    CourseLearningMaterialRepository courseLearningMaterialRepository;
    
    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveLearningMaterial(@RequestParam("moduleId") String moduleId, 
                                                            @RequestParam("status") String status,
                                                            @RequestParam("file") MultipartFile file
                                                            ) throws IOException {
        String fileName = file.getOriginalFilename();
        String contentType = file.getContentType();
        InputStream inputStream = file.getInputStream();

        GridFSBucket gridFSBucket = GridFSBuckets.create(mongoDbFactory.getMongoDatabase());
        ObjectId contentId = gridFSBucket.uploadFromStream(fileName, inputStream);

        CourseLearningMaterialModal newCourseLearningMaterialModal = new CourseLearningMaterialModal();
        newCourseLearningMaterialModal.setLearningMaterialTitle(fileName);
        newCourseLearningMaterialModal.setContentId(contentId.toString());
        newCourseLearningMaterialModal.setContentType(contentType);
        newCourseLearningMaterialModal.setModuleId(moduleId);
        newCourseLearningMaterialModal.setAssignmentId("");
        newCourseLearningMaterialModal.setCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        newCourseLearningMaterialModal.setStatus(status);

        courseLearningMaterialRepository.save(newCourseLearningMaterialModal);
        
        ApiResponse apiResponse = new ApiResponse("Course learning material saved successfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<CourseLearningMaterialModal> getAllLearningMaterials() {
        return courseLearningMaterialRepository.findAll();
    }

    @GetMapping("/get/all/moduleId/{moduleId}")
    public List<CourseLearningMaterialModal> getAllLearningMaterialsByModuleId(@PathVariable String moduleId) {
        return courseLearningMaterialRepository.findAllByModuleId(moduleId);
    }
    

    @GetMapping("/content/get/id/{id}")
    public ResponseEntity<byte[]> getLearningMaterialContentById(@PathVariable String id) throws IOException {
        
        Optional<CourseLearningMaterialModal> courseLearningMaterialModalOptional = courseLearningMaterialRepository.findById(id);

        if(courseLearningMaterialModalOptional.isPresent()){
            CourseLearningMaterialModal existingCourseLearningMaterial = courseLearningMaterialModalOptional.get();

            GridFSBucket gridFSBucket = GridFSBuckets.create(mongoDbFactory.getMongoDatabase());
            GridFSFile gridFSFile = gridFSBucket.find(eq("_id", new ObjectId(existingCourseLearningMaterial.getContentId()))).first();

            if(gridFSFile != null){
                try (InputStream inputStream = gridFSBucket.openDownloadStream(gridFSFile.getObjectId())){
                    byte[] fileBytes = inputStream.readAllBytes();

                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                    headers.setContentDispositionFormData("filename", existingCourseLearningMaterial.getLearningMaterialTitle());
                    headers.setContentLength(fileBytes.length);

                    return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/get/id/{id}")
    public ResponseEntity<CourseLearningMaterialModal> getLearningMaterialById(@PathVariable String id) {
        Optional<CourseLearningMaterialModal> courseLearningMaterialModalOptional = courseLearningMaterialRepository.findById(id);

        return courseLearningMaterialModalOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateLearningMaterialById(@PathVariable String id, @RequestBody CourseLearningMaterialModal courseLearningMaterialModal) {
        Optional<CourseLearningMaterialModal> courseLearningMaterialModalOptional = courseLearningMaterialRepository.findById(id);
        
        if(courseLearningMaterialModalOptional.isPresent()){
            CourseLearningMaterialModal existingCourseLearningMaterial = courseLearningMaterialModalOptional.get();

            existingCourseLearningMaterial.setModuleId(courseLearningMaterialModal.getModuleId());
            existingCourseLearningMaterial.setStatus(courseLearningMaterialModal.getStatus());
            
            courseLearningMaterialRepository.save(existingCourseLearningMaterial);

            ApiResponse apiResponse = new ApiResponse("Course learning material updated successfully");
            return ResponseEntity.ok(apiResponse);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteLearningMaterialById(@PathVariable String id){
        Optional<CourseLearningMaterialModal> courseLearningMaterialModalOptional = courseLearningMaterialRepository.findById(id);

        if(courseLearningMaterialModalOptional.isPresent()){

            // Delete the file from GridFS.
            String contentId = courseLearningMaterialModalOptional.get().getContentId();
            GridFSBucket gridFSBucket = GridFSBuckets.create(mongoDbFactory.getMongoDatabase());
            gridFSBucket.delete(new ObjectId(contentId));

            // Remove the learning material record.
            courseLearningMaterialRepository.deleteById(id);

            ApiResponse apiResponse = new ApiResponse("Learning material deleted successfully");
            return ResponseEntity.ok(apiResponse);
        }

        return ResponseEntity.notFound().build();
    }
}