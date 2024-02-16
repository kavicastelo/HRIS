package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "onboardingPlan")
public class OnboardingPlanModel {
    @Id
    private String id;
    private String onboardingId; // Foreign key referencing the associated onboarding record
    private String description;
    private String taskDate;
}
