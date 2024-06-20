package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "applyJob")
public class ApplyJobModel {

    @Id
    private String id;

    private String name;

    private String job_title;

    private String apply_date;

    private String contact_number;

    private String email;

    private byte[] cv;

    private boolean action;

    private boolean hire;

    private String meeting_link;

    private String meeting_date;

    private String meeting_time;

    private boolean notify;

    private String manager_email;

}
