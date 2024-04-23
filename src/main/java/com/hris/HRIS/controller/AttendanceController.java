package com.hris.HRIS.controller;

import com.hris.HRIS.model.AttendanceModel;
import com.hris.HRIS.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // Endpoint to create a new attendance record
    @PostMapping("/create")
    public ResponseEntity<AttendanceModel> createAttendance(@RequestBody AttendanceModel attendanceModel) {
        AttendanceModel createdAttendance = attendanceService.createAttendance(attendanceModel);
        return new ResponseEntity<>(createdAttendance, HttpStatus.CREATED);
    }

    // Endpoint to retrieve all attendance records
    @GetMapping("/all")
    public ResponseEntity<List<AttendanceModel>> getAllAttendance() {
        List<AttendanceModel> allAttendance = attendanceService.getAllAttendance();
        return new ResponseEntity<>(allAttendance, HttpStatus.OK);
    }

    // Endpoint to retrieve a specific attendance record by ID
    @GetMapping("/{id}")
    public ResponseEntity<AttendanceModel> getAttendanceById(@PathVariable("id") Long id) {
        AttendanceModel attendanceModel = attendanceService.getAttendanceById(id);
        if (attendanceModel != null) {
            return new ResponseEntity<>(attendanceModel, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to update an existing attendance record
    @PutMapping("/{id}")
    public ResponseEntity<AttendanceModel> updateAttendance(@PathVariable("id") Long id, @RequestBody AttendanceModel attendanceModel) {
        AttendanceModel updatedAttendance = attendanceService.updateAttendance(id, attendanceModel);
        if (updatedAttendance != null) {
            return new ResponseEntity<>(updatedAttendance, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to delete an attendance record by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable("id") Long id) {
        boolean deleted = attendanceService.deleteAttendance(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

