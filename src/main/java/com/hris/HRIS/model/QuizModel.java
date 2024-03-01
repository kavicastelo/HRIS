package com.hris.HRIS.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

@Document(collection = "module-quiz")
public class QuizModel {
    @Id
    private String id;
    private String moduleId;
    private String quizName;
    private String quizDescription;
    private Object questions;
    private String noOfAttempts;
    private Double maximumGradeAllowed; // 20% etc...
    private Boolean isRandomized;
    private String startDate;
    private String endDate;
    private String createdDate;
    private String status; // Available, unpublished, Archived.
}
