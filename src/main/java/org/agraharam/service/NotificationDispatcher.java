package org.agraharam.service;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.agraharam.model.Event;
import org.agraharam.model.NotificationSchedule;
import org.agraharam.model.NotificationTemplate;
import org.agraharam.model.User;
import org.agraharam.model.VariableMapping;
import org.agraharam.repository.EventRegistrationRepository;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class NotificationDispatcher {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepo;

    private EventRegistrationRepository eventRegistrationRepo;

    private EventRepository eventRepo;

    public void dispatch(NotificationSchedule schedule) throws JsonMappingException, JsonProcessingException {
        NotificationTemplate template = schedule.getTemplate();
        if (!template.isActive()) return;

        if (schedule.getTriggerType().equals("eventReminder")) {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> condition = objectMapper.readValue(schedule.getTargetCondition(), Map.class);
            Long eventId = condition.containsKey("eventId") ? ((Number) condition.get("eventId")).longValue() : null;
            Event event = eventRepo.findById(eventId).orElseThrow();
            List<User> recipients = eventRegistrationRepo.findRegisteredUsers(eventId);
            for (User user : recipients) {
                Map<String, Object> context = Map.of("user", user, "event", event);
                //NotificationTemplate template = schedule.getTemplate();
                String subject = render(template.getSubject(), template.getVariables(), context);
                String body = render(template.getBody(), template.getVariables(), context);
                notificationService.sendNotification(template.getChannel(), user, subject, body, template.getType());
            }
        }
    }

    private String render(String templateStr, List<VariableMapping> variables, Map<String, Object> context) {
        String result = templateStr;
        for (VariableMapping v : variables) {
            try {
                Object value = resolvePath(context, v.getSource());
                result = result.replace("{{" + v.getName() + "}}", value != null ? value.toString() : "");
            } catch (Exception e) {
                result = result.replace("{{" + v.getName() + "}}", "");
            }
        }
        return result;
    }

    private Object resolvePath(Map<String, Object> context, String path) {
        String[] parts = path.split("\\.");
        Object current = context.get(parts[0]);
        for (int i = 1; i < parts.length && current != null; i++) {
            Field field = ReflectionUtils.findField(current.getClass(), parts[i]);
            if (field == null) return null;
            field.setAccessible(true);
            current = ReflectionUtils.getField(field, current);
        }
        return current;
    }

    public void dispatch(String triggerType, User user) {
        List<NotificationSchedule> schedules = notificationService.findByTriggerType(triggerType);
        for (NotificationSchedule schedule : schedules) {
            NotificationTemplate template = schedule.getTemplate();
            Map<String, Object> context = Map.of("user", user);
            String subject =render(template.getSubject(),template.getVariables(), context);
            String body = render(template.getBody(),template.getVariables(), context);
            notificationService.sendNotification(template.getChannel(),user, subject, body, template.getType(),schedule);
        }
    }
    
}

