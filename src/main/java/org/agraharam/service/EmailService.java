package org.agraharam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendUserApprovalEmail(String firstName,String lastName,String primaryEmail){
        String[] to = {primaryEmail};
        String cc="it@agraharamnc.org";
        String subject = "Welcome to Agraharam NC";
        String message = String.format(
            "Hi %s %s, Welcome to Agraharam\n\n. Please use the website going forard. Please set up the 2 Factor authentication.",
            firstName, lastName
        );

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setCc(cc);
        email.setSubject(subject);
        email.setText(message);
        email.setFrom("no-reply@agraharam.org");

        mailSender.send(email);

    }

    public void sendRegistrationNotice(String firstName, String lastName) {
        String[] to = {
            //primary.getEmail(),
            //spouse.getEmail(),
            "it@agraharamnc.org"
            //"membership@agraharam.org",
            //"president@agraharam.org",
            //"chairman@agraharam.org"
        };

        String subject = "New Family Registration Submitted";
        String message = String.format(
            "A new registration has been submitted:\n\nPrimary: %s %s\n\nPlease review in the admin portal.",
            firstName, lastName
        );

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);
        email.setFrom("no-reply@agraharam.org");

        mailSender.send(email);
    }

    public void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
