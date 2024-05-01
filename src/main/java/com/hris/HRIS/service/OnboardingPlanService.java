package com.hris.HRIS.service;

import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.OnboardingModel;
import com.hris.HRIS.model.OnboardingPlanModel;
import com.hris.HRIS.repository.OnboardingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class OnboardingPlanService {
    @Autowired
    OnboardingPlanRepository onboardingPlanRepository;

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
}
