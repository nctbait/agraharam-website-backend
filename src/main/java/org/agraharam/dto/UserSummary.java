package org.agraharam.dto;

import java.sql.Timestamp;

public record UserSummary(Long id, String name, String email, Timestamp date) {}
