package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EventModel;
import com.hris.HRIS.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/event")
public class EventController {

    @Autowired
    EventRepository eventRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveEvent(@RequestBody EventModel eventModel) {
        eventRepository.save(eventModel);

        ApiResponse apiResponse = new ApiResponse("Event saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<EventModel> getAllEvents() {
        try {
            return eventRepository.findAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
