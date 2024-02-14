package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.ExitListModel;
import com.hris.HRIS.repository.ExitListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/exitlist")
public class ExitListController {

    @Autowired
    ExitListRepository exitListRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveExitList(@RequestBody ExitListModel exitListModel) {

        exitListRepository.save(exitListModel);

        ApiResponse apiResponse = new ApiResponse("Add to exit list successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
