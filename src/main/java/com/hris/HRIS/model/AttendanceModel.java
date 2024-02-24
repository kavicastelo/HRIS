package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
@Getter
@Setter
@ToString

public class AttendanceModel {
    @Id
    private String id;

    private String InTime;

    private String OutTime;

}
