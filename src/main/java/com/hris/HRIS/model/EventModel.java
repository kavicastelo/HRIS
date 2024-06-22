package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "events")
public class EventModel {
    @Id
    private String id;
    private String title;
    private String start;
    private String end;
    private boolean allDay;
}
