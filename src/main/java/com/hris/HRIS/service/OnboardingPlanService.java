package com.hris.HRIS.service;

import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.OnboardingModel;
import com.hris.HRIS.model.OnboardingPlanModel;
import com.hris.HRIS.model.OrganizationModel;
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

//    public String createOnboardingPlan(OnboardingModel onboardingModel) {
//        OnboardingPlanModel onboardingPlanModel = new OnboardingPlanModel();
//        onboardingPlanModel.setDescription(onboardingModel.getDescription());
//        onboardingPlanModel.setTaskDate(onboardingModel.getTaskdate());
//
//        onboardingPlanRepository.save(onboardingPlanModel);
//
//        emailService.sendSimpleEmail(onboardingModel.getEmployeeEmail(), "Onboarding Plan", "New Onboarding Plan Created. Check it out");
//        emailService.sendSimpleEmail(onboardingModel.getAdminEmail(), "Onboarding Plan", "New Onboarding Plan Created. Check it out");
//
//        return lettersGenerationService.generateOnboardingPlan(onboardingPlanModel);
//    }

    public void updateOnboardingPlanOnboarding(OnboardingModel onboardingModel){
        Optional<OnboardingPlanModel> optionalOnboardingPlanModel =  onboardingPlanRepository.findById(onboardingModel.getOnBoardingPlanId());

        if (optionalOnboardingPlanModel.isPresent()) {
            OnboardingPlanModel existingOnboardingPlanModel = optionalOnboardingPlanModel.get();
            // Check if onboarding list is null, and initialize it if necessary
            if (existingOnboardingPlanModel.getOnboarding() == null) {
                existingOnboardingPlanModel.setOnboarding(new ArrayList<>());
            }

            // Add the new onbarding to the list
            existingOnboardingPlanModel.getOnboarding().add(onboardingModel);

            onboardingPlanRepository.save(existingOnboardingPlanModel);

            emailService.sendSimpleEmail(onboardingModel.getEmployeeEmail(), "Onboarding Plan", "New Onboarding Plan Created. Check it out");
            emailService.sendSimpleEmail(onboardingModel.getAdminEmail(), "Onboarding Plan", "New Onboarding Plan Created. Check it out");
        }
    }
}
