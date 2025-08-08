package org.agraharam.pojo;

import java.util.List;

import lombok.Data;

@Data
public class RecaptchaResponse {
    private boolean success;
    private List<String> errorCodes;
}