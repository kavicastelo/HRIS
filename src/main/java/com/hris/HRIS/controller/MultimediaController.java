package com.hris.HRIS.controller;

import com.hris.HRIS.model.MultimediaModel;
import com.hris.HRIS.repository.MultimediaRepository;
import com.hris.HRIS.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
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
    public ResponseEntity<byte[]> getMultimedia(@PathVariable String id) {
        MultimediaModel multimedia = photoService.getMultimedia(id);

        if (multimedia != null && multimedia.getFile() != null && multimedia.getFile().getData() != null) {
            byte[] content = multimedia.getFile().getData();

            HttpHeaders headers = new HttpHeaders();

            // Set content type dynamically based on multimedia content type
            if (multimedia.getContentType() != null) {
                headers.setContentType(MediaType.parseMediaType(multimedia.getContentType()));
            }

            // Set Content-Disposition header to force download or display inline
            headers.setContentDisposition(ContentDisposition.builder("attachment").filename("filename").build());

            return new ResponseEntity<>(content, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
