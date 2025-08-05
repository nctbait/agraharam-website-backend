package org.agraharam.service;

import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.model.Notification;
import org.agraharam.model.NotificationSchedule;
import org.agraharam.model.User;
import org.agraharam.repository.NotificationRepository;
import org.agraharam.repository.NotificationScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private NotificationScheduleRepository scheduleRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void sendNotification(String channel, User user, String subject, String body, String type) {
        // Always store in-app
        Notification notification = new Notification();
        notification.setUserId(user.getId());
        notification.setTitle(subject);
        notification.setMessage(body);
        notification.setType(type);
        notification.setTargetUrl(resolveTargetUrl(type));
        notification.setNotificationRead(false);
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);

        // Conditionally send email
        if ("email".equalsIgnoreCase(channel) && user.getEmail() != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("no-reply@agraharam.org");
                message.setTo(user.getEmail());
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
            } catch (Exception e) {
                // log error
                System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendNotification(String channel, User user, String subject, String body, String type, NotificationSchedule schedule) {
        // Always store in-app
        Notification notification = new Notification();
        notification.setUserId(user.getId());
        notification.setTitle(subject);
        notification.setMessage(body);
        notification.setType(type);
        notification.setTargetUrl(resolveTargetUrl(schedule.getTriggerType()));
        notification.setNotificationRead(false);
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);

        // Conditionally send email
        if ("email".equalsIgnoreCase(channel) && user.getEmail() != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("no-reply@agraharam.org");
                message.setTo(user.getEmail());
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
            } catch (Exception e) {
                // log error
                System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }

    private String resolveTargetUrl(String type) {
        // You can refine this based on scehdule trigger type 
        switch (type) {
            case "eventReminder": return "/user-events";
            case "paymentSuccess": return "/user-payments";
            case "membershipRenewal": return "/membership-upgrade";
            case "onRegistration": return "/register";
            default: return "/";
        }
    }

    public List<NotificationSchedule> findByTriggerType(String triggerType){
        return scheduleRepository.findByTriggerTypeAndActiveTrue(triggerType);
    }
}

