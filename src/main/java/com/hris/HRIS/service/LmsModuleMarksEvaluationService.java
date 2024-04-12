package com.hris.HRIS.service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hris.HRIS.dto.QuizAnswer;
import com.hris.HRIS.model.QuizQuestionModel;
import com.hris.HRIS.repository.EmployeeQuizRepository;
import com.hris.HRIS.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hris.HRIS.model.EmployeeQuizModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LmsModuleMarksEvaluationService {

    @Autowired
    QuizQuestionRepository quizQuestionRepository;

    @Autowired
    EmployeeQuizRepository employeeQuizRepository;

    public void evaluateQuizAnswers(EmployeeQuizModel employeeQuizModel){

        try {
            for (QuizAnswer quizAnswer : employeeQuizModel.getAnswers()) {
                Optional<QuizQuestionModel> originalQuestionOptional = quizQuestionRepository.findById(quizAnswer.getQuestionId());

                // Set default values.
                quizAnswer.setIsCorrect(false);
                quizAnswer.setScore(0.0);
                int noOfCorrectAnsweredAllowed = 0;
                double scorePerCorrectOption = 0; //For the questions that allowed multiple answers.

                if (originalQuestionOptional.isPresent()) {
                    QuizQuestionModel originalQuestion = originalQuestionOptional.get();

                    ArrayList<Object> options = (ArrayList<Object>) originalQuestion.getOptions();

                    if(originalQuestion.getIsMultipleAnswersAllowed()){
                        for (Object option : options){
                            Map<String, Object> optionMap = (Map<String, Object>) option;

                            if((Boolean) optionMap.get("isCorrect")){
                                noOfCorrectAnsweredAllowed++;
                            }
                        }

                        scorePerCorrectOption = originalQuestion.getScoreAllowed()/noOfCorrectAnsweredAllowed;

                    }else{
                        noOfCorrectAnsweredAllowed = 1;
                        scorePerCorrectOption = originalQuestion.getScoreAllowed();
                    }

                    for(String answerGiven : quizAnswer.getAnswersGiven()){
                        for (Object option : options){
                            Map<String, Object> optionMap = (Map<String, Object>) option;

                            if(answerGiven.equals(optionMap.get("optionText").toString())){
                                if((Boolean) optionMap.get("isCorrect")){
                                    quizAnswer.setIsCorrect(true);
                                    quizAnswer.setScore(quizAnswer.getScore() + scorePerCorrectOption);
                                }
                                break;
                            }
                        }
                    }
                }
            }

        }catch (Exception e){
            System.out.println(e);
        }

        employeeQuizRepository.save(employeeQuizModel);
        calculateQuizMarks(employeeQuizModel);
    }

    public Double calculateQuizMarks(EmployeeQuizModel employeeQuizModel){
        return 0.0;
    }
}
