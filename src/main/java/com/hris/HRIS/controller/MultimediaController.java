package com.hris.HRIS.controller;

import com.hris.HRIS.model.MultimediaModel;
import com.hris.HRIS.repository.MultimediaRepository;
import com.hris.HRIS.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/multimedia")
public class MultimediaController {
    @Autowired
    MultimediaRepository multimediaRepository;

    @Autowired
    PhotoService photoService;

    @PostMapping("/photos/add")
    public String addPhoto(@RequestParam("title") String title,
                           @RequestParam("file") MultipartFile file) throws IOException {
        String id = photoService.addMultimedia(title, file, "image/jpeg");
        return "redirect:/photos/" + id;
    }

    @PostMapping("/videos/add")
    public String addVideo(@RequestParam("title") String title,
                           @RequestParam("file") MultipartFile file) throws IOException {
        String id = photoService.addMultimedia(title, file, "video/mp4");
        return "redirect:/videos/" + id;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String id) {
        byte[] photoContent = photoService.getMultimediaContent(id);

        if (photoContent != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // Adjust content type based on your file type

            return new ResponseEntity<>(photoContent, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
