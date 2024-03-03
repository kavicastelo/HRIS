package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.security.PrivateKey;

@Getter
@Setter
@ToString

@Document(collection = "Attendance")
public class AttendanceModel {
    @Id
    private String OrganizationId;
    private String EmployeeId;
    private String InTime;
    private String OutTime;
    private String email;



}
