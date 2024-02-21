package com.hris.HRIS.repository;

import com.hris.HRIS.model.MultimediaModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MultimediaRepository extends MongoRepository<MultimediaModel, String> {
    Optional<MultimediaModel> findAllByUserId(String id);

    Optional<MultimediaModel> findAllByChannelId(String id);

    Optional<MultimediaModel> findAllByChatId(String id);
}
