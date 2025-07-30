package org.agraharam.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.agraharam.dto.EventDTO;
import org.agraharam.dto.EventRegistrationDTO;
import org.agraharam.dto.FamilyMemberRequest;
import org.agraharam.dto.GuestDTO;
import org.agraharam.dto.OfferingSelectionDTO;
import org.agraharam.dto.UserEventViewDTO;
import org.agraharam.enums.EventStatus;
import org.agraharam.model.Event;
import org.agraharam.model.EventOffering;
import org.agraharam.model.EventOfferingSelection;
import org.agraharam.model.EventRegistration;
import org.agraharam.model.Family;
import org.agraharam.model.FamilyMember;
import org.agraharam.model.Guest;
import org.agraharam.model.Payment;
import org.agraharam.model.User;
import org.agraharam.repository.EventOfferingRepository;
import org.agraharam.repository.EventRegistrationRepository;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.FamilyMemberRepository;
import org.agraharam.repository.GuestRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private EventRepository eventRepo;
    @Autowired
    private FamilyMemberRepository familyMemberRepo;
    @Autowired
    private EventRegistrationRepository registrationRepo;
    @Autowired
    private GuestRepository guestRepo;
    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private EventOfferingRepository offeringRepo;

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
                    reg.getEvent().getDate(), // ✅ make sure this returns LocalDate
                    memberNames,
                    guestNames,
                    reg.getStatus().name());
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

        List<User> users = new ArrayList<>();
        List<FamilyMember> members = new ArrayList<>();

        for (FamilyMemberRequest fm : dto.familyMembers()) {
            if (fm.relation() == null || fm.id() == null)
                continue;

            switch (fm.relation().toLowerCase()) {
                case "primary":
                case "spouse":
                    userRepo.findById(fm.id()).ifPresent(users::add);
                    break;
                default:
                    familyMemberRepo.findById(fm.id()).ifPresent(member -> {
                        member.setRelation(fm.relation()); // Optional: preserve original
                        members.add(member);
                    });
                    break;
            }
        }
        reg.setUsers(users);
        reg.setFamilyMembers(members);

        List<EventOfferingSelection> offerings = new ArrayList<>();

        for (OfferingSelectionDTO offer : dto.offerings()) {
            EventOffering eventOffering = offeringRepo.findById(offer.id())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid offering ID"));

            EventOfferingSelection selection = new EventOfferingSelection();
            selection.setRegistration(reg); // make sure 'reg' is already saved
            selection.setOffering(eventOffering);
            selection.setQuantity(offer.quantity());

            offerings.add(selection);
        }
        reg.setOfferings(offerings); // this sets the selections before save

        reg = registrationRepo.save(reg);
        for (GuestDTO guestDTO : dto.guests()) {
            Guest g = new Guest();
            g.setName(guestDTO.name());
            g.setAge(guestDTO.age());
            g.setRegistration(reg);
            guestRepo.save(g);
        }

        Payment payment = new Payment();
        payment.setAmount(dto.totalAmount());
        payment.setConfirmation(dto.zelleConfirmation());
        payment.setPaymentType("event_registration");
        payment.setStatus("pending");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTaxDeductible(true);
        payment.setUser(user); // if you're tracking who submitted
        payment.setDescription(user.getEmail() + " event registration for event id" + dto.eventId() +"- via " + "zelle");
        payment.setReferenceId(reg.getId());//event registration id
        payment.setReferenceyType("EventRegistration");
        payment.setPaymentMethod("zelle");
        paymentRepo.save(payment);
    }

    @Override
    public void updateRegistration(Long id, EventRegistrationDTO dto, String email) {
        EventRegistration reg = registrationRepo.findById(id).orElseThrow();

        if (!reg.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot update this registration");
        }

        // Update Zelle confirmation
        reg.setZelleConfirmation(dto.zelleConfirmation());

        // Update Users (primary, spouse) and FamilyMembers (children)
        List<User> users = new ArrayList<>();
        List<FamilyMember> members = new ArrayList<>();

        for (FamilyMemberRequest fm : dto.familyMembers()) {
            if (fm.relation() == null || fm.id() == null)
                continue;

            switch (fm.relation().toLowerCase()) {
                case "primary":
                case "spouse":
                    userRepo.findById(fm.id()).ifPresent(users::add);
                    break;
                default:
                    familyMemberRepo.findById(fm.id()).ifPresent(member -> {
                        member.setRelation(fm.relation()); // optional
                        members.add(member);
                    });
                    break;
            }
        }

        reg.setUsers(users);
        reg.setFamilyMembers(members);

        // Clear and update guests
        guestRepo.deleteAll(reg.getGuests());

        List<Guest> updatedGuests = dto.guests().stream()
                .map(g -> {
                    Guest guest = new Guest();
                    guest.setName(g.name());
                    guest.setAge(g.age());
                    guest.setRegistration(reg);
                    return guest;
                })
                .toList();

        reg.setGuests(updatedGuests);

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
                        event.getLocation()))
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
                        event.getLocation()))
                .toList();
    }

    @Override
    public EventRegistrationDTO getRegistration(Long id, String email) {
        EventRegistration reg = registrationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!reg.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }

        List<FamilyMemberRequest> family = new ArrayList<>();
        for (User u : reg.getUsers()) {
            family.add(new FamilyMemberRequest(u.getId(), u.getRole().name()));
        }
        for (FamilyMember m : reg.getFamilyMembers()) {
            family.add(new FamilyMemberRequest(m.getId(), m.getRelation()));
        }
        List<GuestDTO> guests = reg.getGuests().stream()
                .map(g -> new GuestDTO(g.getName(), g.getAge(), "Guest"))
                .toList();

        // Offerings
        List<OfferingSelectionDTO> offerings = new ArrayList<>();
         reg.getOfferings().stream()
        .map(o -> new OfferingSelectionDTO(o.getOffering().getId(), o.getQuantity()))
        .toList();

        return new EventRegistrationDTO(
                reg.getEvent().getId(),
                family,
                guests,
                offerings,
                reg.getZelleConfirmation(),
                0.0);
    }

}
