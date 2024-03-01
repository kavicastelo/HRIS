package com.hris.HRIS.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

@Document(collection = "course-module")
public class CourseModuleModal {
    @Id
    private String id;
    private String courseId;
    private String moduleTitle;
    private String moduleDescription;
    private Integer estimatedMinutesToComplete;
    private String preLinkedModuleId; // This is helps to arrange the already created modules according to a order.
    private String startDate;
    private String endDate;
    private String createdDate;
    private String status; // Available, unpublished, Archived.
}
