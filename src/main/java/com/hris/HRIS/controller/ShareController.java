package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.ShareModel;
import com.hris.HRIS.repository.ShareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/share")
public class ShareController {
    @Autowired
    ShareRepository shareRepository;

    @PostMapping
    public ResponseEntity<ApiResponse> saveShare(@RequestBody ShareModel shareModel) {
        shareRepository.save(shareModel);

        ApiResponse apiResponse = new ApiResponse("Share saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<ShareModel> getAllShares() {
        return shareRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<ShareModel> getShareById(@PathVariable String id) {
        Optional<ShareModel> shareModelOptional = shareRepository.findById(id);
        return shareModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/message/{id}")
    public ResponseEntity<List<ShareModel>> getSharesByMessageId(@PathVariable String id) {
        Optional<List<ShareModel>> shareModelOptional = shareRepository.findAllByMessageId(id);
        return ResponseEntity.ok(shareModelOptional.orElse(null));
    }

    @GetMapping("/get/user/{id}")
    public ResponseEntity<List<ShareModel>> getSharesByUserId(@PathVariable String id) {
        Optional<List<ShareModel>> shareModelOptional = shareRepository.findAllByUserId(id);
        return ResponseEntity.ok(shareModelOptional.orElse(null));
    }

    @GetMapping("/get/multimedia/{id}")
    public ResponseEntity<List<ShareModel>> getSharesByMultimediaId(@PathVariable String id) {
        Optional<List<ShareModel>> shareModelOptional = shareRepository.findAllByMultimediaId(id);
        return ResponseEntity.ok(shareModelOptional.orElse(null));
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteShareById(@PathVariable String id) {
        shareRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Share deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
