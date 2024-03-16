package com.hris.HRIS.service;

import org.springframework.stereotype.Service;

import com.hris.HRIS.model.EmployeeQuizModel;

@Service
public class LmsModuleMarksEvaluationService {
    public EmployeeQuizModel evaluateQuizAnswers(EmployeeQuizModel employeeQuizModel){
        return employeeQuizModel;
    }

    public Double calculateQuizMarks(EmployeeQuizModel employeeQuizModel){
        return 0.0;
    }
}
