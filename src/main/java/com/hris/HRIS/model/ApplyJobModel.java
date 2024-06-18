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

@Getter
@Setter
@ToString

@Document(collection = "applyJob")
public class ApplyJobModel {

    @Id
    private String id;

    private String name;

    private String job_title;

    private DateFormat apply_date;

    private String contact_number;

    private String email;

    private byte[] cv;

    private boolean action = false;

    private boolean hire = false;

    private String meeting_link;

    private DateFormat meeting_date;

    private Time meeting_time;

    private boolean notify;

    private String manager_email;

}
