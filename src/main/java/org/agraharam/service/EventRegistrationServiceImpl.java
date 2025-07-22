package org.agraharam.service;

import java.time.LocalDate;
import java.util.List;

import org.agraharam.dto.EventDTO;
import org.agraharam.dto.EventRegistrationDTO;
import org.agraharam.dto.GuestDTO;
import org.agraharam.dto.UserEventViewDTO;
import org.agraharam.enums.EventStatus;
import org.agraharam.model.Event;
import org.agraharam.model.EventRegistration;
import org.agraharam.model.Family;
import org.agraharam.model.FamilyMember;
import org.agraharam.model.Guest;
import org.agraharam.model.User;
import org.agraharam.repository.EventRegistrationRepository;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.FamilyMemberRepository;
import org.agraharam.repository.GuestRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {

    @Autowired private UserRepository userRepo;
    @Autowired private EventRepository eventRepo;
    @Autowired private FamilyMemberRepository familyMemberRepo;
    @Autowired private EventRegistrationRepository registrationRepo;
    @Autowired private GuestRepository guestRepo;


    @Override
    public List<UserEventViewDTO> getMyRegistrations(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Family family = user.getFamily();
        List<EventRegistration> registrations = registrationRepo.findByUser_Family(family);


        return registrations.stream().map(reg -> {
            List<String> guestNames = reg.getGuests().stream()
                .map(Guest::getName).toList();
        
            List<String> memberNames = reg.getFamilyMembers().stream()
                .map(FamilyMember::getName).toList();
        
            return new UserEventViewDTO(
                reg.getId(),
                reg.getEvent().getId(),
                reg.getEvent().getTitle(),
                reg.getEvent().getDate(),  // ✅ make sure this returns LocalDate
                memberNames,
                guestNames,
                reg.getStatus().name()
            );
        }).toList();
        
    }

    @Override
    public void register(EventRegistrationDTO dto, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Event event = eventRepo.findById(dto.eventId()).orElseThrow();

        EventRegistration reg = new EventRegistration();
        reg.setUser(user);
        reg.setEvent(event);
        reg.setStatus(EventStatus.CONFIRMED); // Add waitlist logic here if needed
        reg.setZelleConfirmation(dto.zelleConfirmation());

        List<FamilyMember> members = familyMemberRepo.findAllById(dto.familyMemberIds());
        reg.setFamilyMembers(members);

        reg = registrationRepo.save(reg);

        for (GuestDTO guestDTO : dto.guests()) {
            Guest g = new Guest();
            g.setName(guestDTO.name());
            g.setAge(guestDTO.age());
            g.setRegistration(reg);
            guestRepo.save(g);
        }
    }

    @Override
    public void updateRegistration(Long id, EventRegistrationDTO dto, String email) {
        EventRegistration reg = registrationRepo.findById(id).orElseThrow();

        if (!reg.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot update this registration");
        }

        reg.setZelleConfirmation(dto.zelleConfirmation());
        reg.setFamilyMembers(familyMemberRepo.findAllById(dto.familyMemberIds()));

        guestRepo.deleteAll(reg.getGuests()); // Remove old guests

        for (GuestDTO guestDTO : dto.guests()) {
            Guest g = new Guest();
            g.setName(guestDTO.name());
            g.setAge(guestDTO.age());
            g.setRegistration(reg);
            guestRepo.save(g);
        }

        registrationRepo.save(reg);
    }

    @Override
    public void cancelRegistration(Long id, String email) {
        EventRegistration reg = registrationRepo.findById(id).orElseThrow();

        if (!reg.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot cancel this registration");
        }

        reg.setStatus(EventStatus.CANCELLED);
        registrationRepo.save(reg);
    }

    @Override
    public List<EventDTO> getAvailableEventsForFamily(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Family family = user.getFamily();
        LocalDate today = LocalDate.now();

        List<Event> upcomingEvents = eventRepo.findByDateAfter(today);
        List<Long> registeredEventIds = registrationRepo.findByUser_Family(family)
            .stream().map(reg -> reg.getEvent().getId()).toList();

            return upcomingEvents.stream()
            .filter(event -> !registeredEventIds.contains(event.getId()))
            .map(event -> new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getLocation()
            ))
            .toList();
    }

    @Override
    public List<EventDTO> getPastEventsForFamily(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Family family = user.getFamily();
        LocalDate today = LocalDate.now();

        return registrationRepo.findByUser_Family(family).stream()
            .map(EventRegistration::getEvent)
            .filter(event -> event.getDate().isBefore(today))
            .distinct()
            .map(event -> new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getLocation()
            ))
            .toList();
    } 
}
