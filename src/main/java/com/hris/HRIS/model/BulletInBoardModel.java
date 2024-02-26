package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "bullet_in_board")
public class BulletInBoardModel {
    @Id
    private String id;
    private Object messages; // messages ids
    private Object documents; // documents ids
}
