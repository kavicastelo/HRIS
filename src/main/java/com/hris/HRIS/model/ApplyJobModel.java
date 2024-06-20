package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Time;
import java.text.DateFormat;
import java.util.Date;

@Getter
@Setter
@ToString

@Document(collection = "applyJob")
public class ApplyJobModel {

    @Id
    private String id;

    private String name;

    private String job_title;

    private Date apply_date;

    private String contact_number;

    private String email;

    private byte[] cv;

    private boolean action = false; //1st stage to 2nd stage

    private boolean hire = false; //2nd stage to hiring stage

    private String meeting_link;

    private Date meeting_date;

    private Date meeting_time;

    private boolean notify;

    private String manager_email;

}
