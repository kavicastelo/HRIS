package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "multimedia")
public class MultimediaModel {
    @Id
    private String id;
    private String userId;
    private String channelId;
    private String chatId;
    private Binary file;
    private String title;
    private String status;
    private String timestamp;
    private String contentType;
}
