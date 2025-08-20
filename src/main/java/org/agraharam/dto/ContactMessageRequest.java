package org.agraharam.dto;

public record ContactMessageRequest(
  String name,
  String email,
  String phone,
  String committee,
  String message,
  String captchaToken
) {}