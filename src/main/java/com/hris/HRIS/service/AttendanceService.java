package com.hris.HRIS.service;

import com.hris.HRIS.model.AttendanceModel;
import com.hris.HRIS.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    AttendanceRepository attendanceRepository;
    public AttendanceModel createAttendance(AttendanceModel attendanceModel) {
        return null;
    }

    public List<AttendanceModel> getAllAttendance() {
        return null;

    }

    public AttendanceModel getAttendanceById(Long id) {
        return null;
    }

    public AttendanceModel updateAttendance(Long id, AttendanceModel attendanceModel) {
        return null;
    }

    public boolean deleteAttendance(Long id) {
        return false;
    }
}
