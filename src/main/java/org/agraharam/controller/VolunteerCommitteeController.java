package org.agraharam.controller;

import java.util.List;

import org.agraharam.dto.CommitteeDTO;
import org.agraharam.model.VolunteerCommittee;
import org.agraharam.repository.VolunteerCommitteeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/committees")
@RequiredArgsConstructor
public class VolunteerCommitteeController {

    @Autowired
    private  VolunteerCommitteeRepository committeeRepository;

    @GetMapping("/active")
    public ResponseEntity<List<CommitteeDTO>> getActiveCommittees() {
        List<VolunteerCommittee> active = committeeRepository.findByActiveTrueOrderByNameAsc();
        List<CommitteeDTO> result = active.stream()
                                          .map(CommitteeDTO::fromEntity)
                                          .toList();
        return ResponseEntity.ok(result);
    }
}

