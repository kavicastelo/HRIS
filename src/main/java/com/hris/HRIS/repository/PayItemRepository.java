package com.hris.HRIS.repository;

import com.hris.HRIS.model.PayItemModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PayItemRepository extends MongoRepository<PayItemModel, String> {
    
}
