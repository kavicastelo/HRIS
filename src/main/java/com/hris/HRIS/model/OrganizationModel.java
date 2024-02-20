package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "organization")
public class OrganizationModel {
    @Id
    private String id;
    private String organizationName;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private Object departments;
    private Object employees;
    private String description;
    private String photo;
}
