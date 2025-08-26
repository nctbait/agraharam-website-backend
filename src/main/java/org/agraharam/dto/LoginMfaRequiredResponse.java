package org.agraharam.dto;

public record LoginMfaRequiredResponse(boolean mfaRequired, String challengeId, int expiresInSeconds) {}

