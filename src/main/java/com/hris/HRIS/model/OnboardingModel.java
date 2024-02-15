package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "onboarding")
public class OnboardingModel {
    @Id
    private String id;
    private String employeeEmail; // Foreign key to EmployeeModel
    private String adminEmail;    // Foreign key to EmployeeModel with level 0
    private String date;
    private String status;
}
