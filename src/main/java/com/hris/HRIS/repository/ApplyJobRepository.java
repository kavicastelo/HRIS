package com.hris.HRIS.repository;

import com.hris.HRIS.model.ApplyJobModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplyJobRepository extends MongoRepository<ApplyJobModel, String> {

    List<ApplyJobModel> findByFavoriteTrue();

    //count CVs
    long countByCvNotNull();

    //Count by favourite true
    long countByFavoriteTrue();
}
