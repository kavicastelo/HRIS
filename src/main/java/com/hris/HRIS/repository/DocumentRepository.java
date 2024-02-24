package com.hris.HRIS.repository;

import com.hris.HRIS.model.DocumentModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends MongoRepository<DocumentModel, String> {
    Optional<List<DocumentModel>> findAllByAdminId(String adminId);

    void deleteAllByAdminId(String id);
}
