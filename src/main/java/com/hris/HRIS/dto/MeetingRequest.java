package com.hris.HRIS.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.text.DateFormat;

@Getter
@Setter
public class MeetingRequest {

    private String id;
    private DateFormat meetingDate;
    private Time meetingTime;
    private String meetingLink;
    private String userEmail;
    private String managerEmail;
    private boolean notify;
}
