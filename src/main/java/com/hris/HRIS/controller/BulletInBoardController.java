package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.BulletInBoardModel;
import com.hris.HRIS.repository.BulletInBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/bullet-in-board")
public class BulletInBoardController {
    @Autowired
    BulletInBoardRepository bulletInBoardRepository;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveBulletInBoard(@RequestBody BulletInBoardModel bulletInBoardModel){
        bulletInBoardRepository.save(bulletInBoardModel);

        ApiResponse apiResponse = new ApiResponse("Bullet in board saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<BulletInBoardModel> getAllBulletInBoard(){
        return bulletInBoardRepository.findAll();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<BulletInBoardModel> getBulletInBoardById(@PathVariable String id){
        Optional<BulletInBoardModel> bulletInBoardModelOptional = bulletInBoardRepository.findById(id);

        return bulletInBoardModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteBulletInBoard(@PathVariable String id){
        bulletInBoardRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Bullet in board removed successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
