package org.agraharam.service;

import org.agraharam.pojo.RecaptchaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {

    @Value("${recaptcha.secret-key}")
    private String secret;

    public boolean verify(String token) {
        String url = "https://www.google.com/recaptcha/api/siteverify";
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", secret);
        params.add("response", token);

        RecaptchaResponse resp = restTemplate.postForObject(url, params, RecaptchaResponse.class);
        return resp != null && resp.isSuccess();
    }

    
}

