package com.email.writer.app;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://mail.google.com"
})
public class EmailGenController {

    private final EmailGenService emailGenService;

    public EmailGenController(EmailGenService emailGenService){
        this.emailGenService = emailGenService;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateMail(@RequestBody EmailRequest emailRequest){
        String response = emailGenService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
