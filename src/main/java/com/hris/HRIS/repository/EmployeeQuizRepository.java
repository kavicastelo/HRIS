package com.hris.HRIS.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hris.HRIS.model.EmployeeQuizModel;

public interface EmployeeQuizRepository extends MongoRepository<EmployeeQuizModel, String> {
    
}
