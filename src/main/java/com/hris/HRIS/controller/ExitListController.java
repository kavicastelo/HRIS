package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.ExitListModel;
import com.hris.HRIS.repository.ExitListRepository;
import com.hris.HRIS.service.SystemAutomateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exitlist")
public class ExitListController {

    @Autowired
    ExitListRepository exitListRepository;

    @Autowired
    SystemAutomateService systemAutomateService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveExitList(@RequestBody ExitListModel exitListModel) {

        exitListRepository.save(exitListModel);

        systemAutomateService.UpdateEmployeeJobDataExit(exitListModel);

        float gratuity = systemAutomateService.CalculateGratuity(exitListModel);

        ApiResponse apiResponse = new ApiResponse(gratuity+"");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<ExitListModel> getAllExitList() {
        return exitListRepository.findAll();
    }
}
