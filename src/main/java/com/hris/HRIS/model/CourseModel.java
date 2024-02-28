package com.hris.HRIS.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

@Document(collection = "course")
public class CourseModel {
    @Id
    private String id;
    private String courseCode;
    private String courseName;
    private String courseDescription;
    private Object users;
    private Integer enrollmentLimit;
    private String gradingScale; // i.e.: LETTER_GRADES, PERCENTAGE)
    private String startDate;
    private String endDate;
    private String courseCreatedDate;
    private String status;
}
