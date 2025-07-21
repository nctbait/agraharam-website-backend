package org.agraharam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailTestController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/api/test-email")
    public String sendTestEmail() {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("cnelapa@gmail.com");
        msg.setSubject("Test from Agraharam App");
        msg.setText("This is a test email sent via Spring Boot + Gmail SMTP.");
        msg.setFrom("yourgmail@gmail.com");

        mailSender.send(msg);
        return "Email sent";
    }
}
