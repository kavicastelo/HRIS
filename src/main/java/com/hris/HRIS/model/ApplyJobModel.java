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

    private boolean action; //1st stage to 2nd stage

    private boolean hire; //2nd stage to hiring stage

    private String meeting_link;

    private String meeting_date;

    private String meeting_time;

    private boolean notify;

    private String manager_email;

}
