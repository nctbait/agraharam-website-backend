package org.agraharam.dto;

public record MfaVerifyRequest(String challengeId, String code) {}

