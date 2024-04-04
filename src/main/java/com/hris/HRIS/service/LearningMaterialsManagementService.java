package com.hris.HRIS.service;

import com.hris.HRIS.model.CourseLearningMaterialModal;
import com.hris.HRIS.repository.CourseLearningMaterialRepository;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.mongodb.MongoDatabaseFactory;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;

@Service
public class LearningMaterialsManagementService {

    @Autowired
    private MongoDatabaseFactory mongoDbFactory;

    @Autowired
    CourseLearningMaterialRepository courseLearningMaterialRepository;
    public void saveLearningMaterial(String moduleId, String assignmentId, String status, MultipartFile file) throws IOException {

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
        newCourseLearningMaterialModal.setAssignmentId(assignmentId);
        newCourseLearningMaterialModal.setCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        newCourseLearningMaterialModal.setStatus(status);

        courseLearningMaterialRepository.save(newCourseLearningMaterialModal);

    }
}
