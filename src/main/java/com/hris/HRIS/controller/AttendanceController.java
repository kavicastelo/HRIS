package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.AttendanceModel;
import com.hris.HRIS.model.CredentialsModel;
import com.hris.HRIS.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/attendance")

public class AttendanceController {

    @Autowired
    AttendanceRepository attendanceRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveAttendance(AttendanceModel attendanceModel) {
        attendanceRepository.save(attendanceModel);

        ApiResponse apiResponse = new ApiResponse("Attendance Saved Successfully");
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/get/all")
    public List<AttendanceModel> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<AttendanceModel> getAttendanceByEmail(@PathVariable String email) {
        Optional<AttendanceModel> attendanceModelOptional = attendanceRepository.findByEmail(email);

        return attendanceModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }




}
