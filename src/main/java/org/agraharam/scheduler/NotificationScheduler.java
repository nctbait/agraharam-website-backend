package org.agraharam.scheduler;

import org.agraharam.model.NotificationSchedule;
import org.agraharam.model.NotificationTemplate;
import org.agraharam.model.User;
import org.agraharam.repository.NotificationScheduleRepository;
import org.agraharam.service.NotificationDispatcher;
import org.agraharam.service.TemplateRenderer;
import org.agraharam.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class NotificationScheduler {

    @Autowired
    private NotificationScheduleRepository scheduleRepo;

    @Autowired
    private NotificationDispatcher dispatcher;

    @Scheduled(fixedRate = 60000) // Runs every minute
    public void processScheduledNotifications() throws JsonMappingException, JsonProcessingException {
        List<NotificationSchedule> schedules = scheduleRepo.findByActiveTrue();
        for (NotificationSchedule schedule : schedules) {
            dispatcher.dispatch(schedule);
        }
    }
}

