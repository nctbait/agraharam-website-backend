package org.agraharam.dto;

import org.agraharam.model.Address;
import org.agraharam.model.Family;
import org.agraharam.model.User;

public record UserDetailDto(User user, Family family, Address address) {}

