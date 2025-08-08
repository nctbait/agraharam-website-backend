package org.agraharam.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.agraharam.service.RateLimitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimiterFilter extends OncePerRequestFilter {

    private static final String HEADER_LIMIT_REMAINING = "X-Rate-Limit-Remaining";
    private static final String HEADER_RETRY_AFTER = "X-Rate-Limit-Retry-After-Seconds";
    private static final long NANO_SECONDS = 1_000_000_000L;
    @Autowired
    RateLimitService rateLimitService;

    public RateLimiterFilter(RateLimitService rateLimitService) {
        super();
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Use a key to identify the client, e.g., IP address or user ID
        String key = request.getRemoteAddr();
        Bucket bucket = rateLimitService.resolveBucket(key);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1); // Consume one token per request

        if (probe.isConsumed()) {
            response.setHeader(HEADER_LIMIT_REMAINING, String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long waitToRefill = probe.getNanosToWaitForRefill() / NANO_SECONDS;
            response.setContentType("application/json");
            response.addHeader(HEADER_RETRY_AFTER, String.valueOf(waitToRefill));
            response.addHeader(HEADER_LIMIT_REMAINING, String.valueOf(probe.getRemainingTokens()));
            response.setStatus(429); // Too Many Requests
            response.getWriter()
                    .write("{\"error\": \"Too many requests, please try again after " + waitToRefill + " seconds.\"}");
        }
    }
}
