package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "jobPost")
public class JobPostModel {

    @Id
    private String Id;

    private String caption;

    private String about_job;

    private String technical_requirements;

    private String description;
}
