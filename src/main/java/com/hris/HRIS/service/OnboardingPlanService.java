package com.hris.HRIS.service;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.OnboardingModel;
import com.hris.HRIS.model.OnboardingPlanModel;
import com.hris.HRIS.repository.OnboardingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OnboardingPlanService {
    @Autowired
    OnboardingPlanRepository onboardingPlanRepository;

    @Autowired
    LettersGenerationService lettersGenerationService;

    @Autowired
    EmailService emailService;

    public String createOnboardingPlan(OnboardingModel onboardingModel) {
        OnboardingPlanModel onboardingPlanModel = new OnboardingPlanModel();
        onboardingPlanModel.setOnboardingId(onboardingModel.getId());
        onboardingPlanModel.setDescription(onboardingModel.getDescription());
        onboardingPlanModel.setTaskDate(onboardingModel.getTaskdate());

        onboardingPlanRepository.save(onboardingPlanModel);

        emailService.sendSimpleEmail(onboardingModel.getEmployeeEmail(), "Onboarding Plan", "New Onboarding Plan Created. Check it out");
        emailService.sendSimpleEmail(onboardingModel.getAdminEmail(), "Onboarding Plan", "New Onboarding Plan Created. Check it out");

        return lettersGenerationService.generateOnboardingPlan(onboardingPlanModel);
    }
}
