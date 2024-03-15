package com.hris.HRIS.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

@Document(collection = "employee-quiz")
public class EmployeeQuizModel {
    @Id
    private String id;
    private String employeeEmail;
    private String quizId;
    private Object answers; // [{questionId:"{questionId}", answer: {string}}]
    private String attemptDateTime;
    private String submittedDateTime;
    private Integer score;
}