package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.model.Notification;
import org.agraharam.model.User;
import org.agraharam.repository.NotificationRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/my")
    public List<Notification> getMyNotifications(Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        return notificationRepository.findByUserIdOrderByTimestampDesc(user.getId());
    }

    @GetMapping("/unread-count")
    public long getUnreadCount(Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        return notificationRepository.countByUserIdAndNotificationReadFalse(user.getId());
    }

    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setNotificationRead(true);
            notificationRepository.save(n);
        });
    }
}

