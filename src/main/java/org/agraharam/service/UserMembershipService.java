package org.agraharam.service;

import java.util.List;

import org.agraharam.dto.UserMembershipDTO;

public interface UserMembershipService {
    List<UserMembershipDTO> getPendingRequests();
    void approveMemberships(List<Long> ids);
    void rejectMemberships(List<Long> ids);
}

