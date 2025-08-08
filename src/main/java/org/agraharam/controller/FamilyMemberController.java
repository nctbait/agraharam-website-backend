package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.FamilyMemberDTO;
import org.agraharam.dto.PrimaryDTO;
import org.agraharam.dto.SpouseDTO;
import org.agraharam.dto.UserSearchResult;
import org.agraharam.model.FamilyMember;
import org.agraharam.model.User;
import org.agraharam.repository.FamilyMemberRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.AuditLogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/family")
public class FamilyMemberController {
    @Autowired
    FamilyMemberRepository repo;
    @Autowired
    UserRepository userRepo;

    @Autowired
    AuditLogServiceImpl auditLogService;

    @GetMapping("/current_members")
    public List<FamilyMemberDTO> getAllForCurrentUser(Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        List<FamilyMember> members = repo.findByFamilyId(user.getFamily().getId());

        return members.stream()
                .map(m -> new FamilyMemberDTO(
                        m.getId(), m.getName(), m.getAge(), m.getRelation(),
                        m.getSchool(), m.getSkills(), m.getPreferences()))
                .toList();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMember(@RequestBody FamilyMemberDTO dto, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        FamilyMember member = new FamilyMember();

        member.setName(dto.name());
        member.setAge(dto.age());
        member.setRelation(dto.relation());
        member.setSchool(dto.school());
        member.setSkills(dto.skills());
        member.setPreferences(dto.preferences());
        member.setFamily(user.getFamily());

        FamilyMember saved = repo.save(member);

        auditLogService.log("ADD_CHILD", user.getEmail(), "FamilyMember", String.valueOf(saved.getId()),
                "Child added: " + saved.getName());

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody FamilyMemberDTO dto, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();

        FamilyMember existing = repo.findById(id).orElseThrow();
        existing.setName(dto.name());
        existing.setAge(dto.age());
        existing.setRelation(dto.relation());
        existing.setSchool(dto.school());
        existing.setSkills(dto.skills());
        existing.setPreferences(dto.preferences());

        FamilyMember updated = repo.save(existing);

        auditLogService.log("EDIT_CHILD", user.getEmail(), "FamilyMember", String.valueOf(id),
                "Child edited: " + updated.getName());

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        FamilyMember member = repo.findById(id).orElseThrow();

        if (!member.getFamily().getId().equals(user.getFamily().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        repo.deleteById(id);

        auditLogService.log("DELETE_CHILD", user.getEmail(), "FamilyMember", String.valueOf(id),
                "Child deleted: " + member.getName());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/spouse")
    public SpouseDTO getSpouse(Principal principal) {
        User primary = userRepo.findByEmail(principal.getName()).orElseThrow();
        User spouse = primary.getFamily().getUsers().stream()
                .filter(u -> u.getRole().name().equals("spouse"))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spouse not found"));

        return new SpouseDTO(
                spouse.getId(),
                spouse.getFirstName(),
                spouse.getLastName(),
                spouse.getEmail(),
                spouse.getPhoneNumber());
    }

    @GetMapping("/primary")
    public PrimaryDTO getPrimary(Principal principal) {
        User primary = userRepo.findByEmail(principal.getName()).orElseThrow();

        return new PrimaryDTO(
                primary.getId(),
                primary.getFirstName(),
                primary.getLastName(),
                primary.getEmail(),
                primary.getPhoneNumber());
    }

    @PutMapping("/spouse")
    public ResponseEntity<?> updateSpouse(@RequestBody User updatedSpouse, Principal principal) {
        User primary = userRepo.findByEmail(principal.getName()).orElseThrow();
        User spouse = primary.getFamily().getUsers().stream()
                .filter(u -> !u.getEmail().equals(primary.getEmail()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Spouse not found"));

        spouse.setFirstName(updatedSpouse.getFirstName());
        spouse.setLastName(updatedSpouse.getLastName());
        spouse.setPhoneNumber(updatedSpouse.getPhoneNumber());

        userRepo.save(spouse);

        auditLogService.log("EDIT_SPOUSE", primary.getEmail(), "User", String.valueOf(spouse.getId()),
                "Spouse details updated");

        // Optional: add other editable fields

        return ResponseEntity.ok(spouse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FamilyMemberDTO> getMemberById(@PathVariable Long id, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        FamilyMember member = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Family member not found"));

        // Ensure the member belongs to the logged-in user's family
        if (!member.getFamily().getId().equals(user.getFamily().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        FamilyMemberDTO dto = new FamilyMemberDTO(
                member.getId(),
                member.getName(),
                member.getAge(),
                member.getRelation(),
                member.getSchool(),
                member.getSkills(),
                member.getPreferences());

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/user-search")
    public List<UserSearchResult> getUserbyNameofEmail(@RequestParam("query") String query){
        return userRepo.searchByNameOrEmail(query).stream().filter(u -> u.getRole().name().equals("primary") && u.isHasLogin())
        .map(u -> new UserSearchResult(
                u.getId(),
                u.getFamily().getId(),
                u.getFirstName(),
                u.getLastName(),
                u.getEmail()
            )
        )
        .toList();
    }

}
