package com.hris.HRIS.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

@Document(collection = "quiz-question")
public class QuizQuestionModel {
    @Id
    private String id;
    private String quizId;
    private String question;
    private Object options; // [{optionText:"{string}", isCorrect: {bool}}]
    private String questionType;
    private Boolean isMultipleAnswersAllowed;
    private String preLinkedQuizQuestionId; // This is helps to arrange the already created questions of a quiz according to a order.
}

/*

Sample imput format:
{
    "quizId" : "65e802711ca37a6261b4b7a3",
    "question" : "Find the value of x, x = 2 + 4",
    "options" : [
        {"optionText" : "x = 5", "isCorrect" : false},
        {"optionText" : "x = 3", "isCorrect" : false},
        {"optionText" : "x = 6", "isCorrect" : true},
        {"optionText" : "x = 0", "isCorrect" : false}
    ],
    "questionType" : "multiple choice",
    "isMultipleAnswersAllowed" : false
}

*/