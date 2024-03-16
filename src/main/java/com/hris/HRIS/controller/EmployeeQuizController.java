package com.hris.HRIS.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeQuizModel;
import com.hris.HRIS.model.QuizModel;
import com.hris.HRIS.model.QuizQuestionModel;
import com.hris.HRIS.repository.EmployeeQuizRepository;
import com.hris.HRIS.repository.QuizRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


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

    @Autowired
    CourseController courseController;

    @Autowired
    CourseModuleController courseModuleController;

    @GetMapping("/attempt")
    public ArrayList<Object> attemptQuiz(@RequestBody String requestBody){
        ObjectMapper objectMapper = new ObjectMapper();

        List<QuizQuestionModel> questionsList = new ArrayList<>();
        ArrayList<Object> result = new ArrayList<>();

        String returnMsg = "";

        try {
            JsonNode requestBodyJson = objectMapper.readTree(requestBody);
            String quizId = requestBodyJson.get("quizId").asText();
            String employeeEmail = requestBodyJson.get("employeeEmail").asText();
            
            Optional<QuizModel> quizModalOptional = quizRepository.findById(quizId);

            if(quizModalOptional.isPresent()){
                String courseId = courseModuleController.getCourseModuleById(quizModalOptional.get().getModuleId()).getBody().getCourseId();

                if(courseController.checkIsCourseUsersExists(courseId, employeeEmail)){
                    questionsList = quizQuestionController.getAllQuizQuestionsByQuizId(quizId);

                    if(quizModalOptional.get().getIsRandomized()){
                        Collections.shuffle(questionsList);
                    }

                    // Create a new attempt.
                    EmployeeQuizModel employeeQuizModel = new EmployeeQuizModel();

                    employeeQuizModel.setEmployeeEmail(employeeEmail);
                    employeeQuizModel.setQuizId(quizId);
                    // employeeQuizModel.setAttempt(1);
                    employeeQuizModel.setAttemptDateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    employeeQuizModel.setSubmittedDateTime("0000-00-00 00:00:00");
                    employeeQuizModel.setStatus("Inprogress");

                    returnMsg = employeeQuizRepository.save(employeeQuizModel).getId();
                }else{
                    returnMsg = "The requested user does not exists in the course";
                }
            }else{
                returnMsg = "The requested quiz does not exists.";
            }
        } catch (Exception e) {
            returnMsg = "Failed to handle the received parameters";
        }

        result.add(returnMsg);
        result.add(questionsList);

        return result;
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submitQuiz(@RequestBody String requestBody) {
        //TODO: process POST request
        
        ApiResponse apiResponse = new ApiResponse("Quiz submitted successfully");
        return ResponseEntity.ok(apiResponse);
    }
    
}