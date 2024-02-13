package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "employee-transfer")
public class TransferModel {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Object jobData;
    private String date;
    private String doj;
    private String photo;
    private String reason;
    private Boolean approved;
}
