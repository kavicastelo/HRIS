package com.hris.HRIS.model;

import com.hris.HRIS.enums.LeaveType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "Leave")
public class LeaveModel {
    @Id
    private String id;
    private String organizationId;
    private String employeeName;
    private String leaveReason;
    private LeaveType leaveType;
    private Date leaveStartDate;
    private Date leaveEndDate;
    private String leaveApproverName;
    private boolean approved;
    private double leaveBalance;
}
