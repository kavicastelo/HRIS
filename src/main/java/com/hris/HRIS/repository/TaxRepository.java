package com.hris.HRIS.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hris.HRIS.model.TaxModel;

public interface TaxRepository extends MongoRepository<TaxModel, String> {
    
}
