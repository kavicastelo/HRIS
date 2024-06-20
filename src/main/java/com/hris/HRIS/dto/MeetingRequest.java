package com.hris.HRIS.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.text.DateFormat;
import java.util.Date;

@Getter
@Setter
public class MeetingRequest {

    private String id;
    private Date meetingDate;
    private Date meetingTime;
    private String meetingLink;
    private String userEmail;
    private String managerEmail;
    private boolean notify;
}
