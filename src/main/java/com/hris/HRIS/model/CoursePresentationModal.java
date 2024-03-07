package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "course-presentation")
public class CoursePresentationModal {
    @Id
    private String id;
    private String moduleId;
    private String presentationTitle;
    private String content;
    private String createdDate;
    private String status;
}
