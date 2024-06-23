package com.hris.HRIS.service;

import com.hris.HRIS.model.EventModel;
import com.hris.HRIS.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<EventModel> getAllEvents() {
        return eventRepository.findAll();
    }

    public EventModel saveEvent(EventModel eventModel) {
        return eventRepository.save(eventModel);
    }

    public Optional<EventModel> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
}
