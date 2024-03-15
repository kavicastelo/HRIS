package com.hris.HRIS.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeQuizModel;
import com.hris.HRIS.model.QuizModel;
import com.hris.HRIS.model.QuizQuestionModel;
import com.hris.HRIS.repository.EmployeeQuizRepository;
import com.hris.HRIS.repository.QuizQuestionRepository;
import com.hris.HRIS.repository.QuizRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.swing.text.html.Option;

@RestController
@RequestMapping("/api/v1/lms/course/module/quiz")
public class EmployeeQuizController {
    @Autowired
    EmployeeQuizRepository employeeQuizRepository;

    @Autowired
    QuizController quizController;

    @Autowired
    QuizRepository quizRepository;

    @Autowired
    QuizQuestionController quizQuestionController;

    @GetMapping("/attempt")
    public List<QuizQuestionModel> attemptQuiz(@RequestBody String requestBody){
        ObjectMapper objectMapper = new ObjectMapper();

        List<QuizQuestionModel> questionsList = new ArrayList<>();

        try {
            JsonNode requestBodyJson = objectMapper.readTree(requestBody);
            String quizId = requestBodyJson.get("quizId").asText();
            String employeeEmail = requestBodyJson.get("employeeEmail").asText();
            
            Optional<QuizModel> quizModalOptional = quizRepository.findById(quizId);

            if(quizModalOptional.isPresent()){
                questionsList = quizQuestionController.getAllQuizQuestionsByQuizId(quizId);

                // Create a new attempt.
                EmployeeQuizModel employeeQuizModel = new EmployeeQuizModel();

                employeeQuizModel.setEmployeeEmail(employeeEmail);
                employeeQuizModel.setQuizId(quizId);
                // employeeQuizModel.setAttempt(1);
                employeeQuizModel.setAttemptDateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

                employeeQuizRepository.save(employeeQuizModel);
            }
        } catch (Exception e) {
            // TODO: handle exception
        }

        return questionsList;
    }
}
