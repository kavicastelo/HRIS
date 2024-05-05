package com.hris.HRIS.service;

import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.OnboardingModel;
import com.hris.HRIS.model.OnboardingPlanModel;
import com.hris.HRIS.repository.OnboardingPlanRepository;
import com.hris.HRIS.repository.OnboardingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OnboardingPlanService {
    @Autowired
    OnboardingPlanRepository onboardingPlanRepository;

    @Autowired
    OnboardingRepository onboardingRepository;

    @Autowired
    LettersGenerationService lettersGenerationService;

    @Autowired
    EmailService emailService;

    public void setOnboardinsToPlan(OnboardingModel onboardingModel){
        Optional<OnboardingPlanModel> plan =  onboardingPlanRepository.findById(onboardingModel.getOnBoardingPlanId());

        if (plan.isPresent()) {
            OnboardingPlanModel existingPlan = plan.get();

            if (existingPlan.getOnboarding() == null) {
                existingPlan.setOnboarding(new ArrayList<>());
            }

            existingPlan.getOnboarding().add(onboardingModel);

            onboardingPlanRepository.save(existingPlan);
        }
    }

    public void addEmployeesToOnboarding(String id, List<EmployeeModel> employeeModels) {
        Optional<OnboardingModel> onboardingModelOptional = onboardingRepository.findById(id);

        if (onboardingModelOptional.isPresent()) {
            OnboardingModel onboardingModel = onboardingModelOptional.get();

            if (onboardingModel.getEmployees() == null) {
                onboardingModel.setEmployees(new ArrayList<>());
            }

            // Add all employees to the list
            onboardingModel.getEmployees().addAll(employeeModels);

            onboardingRepository.save(onboardingModel);
        }
    }

}
