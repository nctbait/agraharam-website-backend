package org.agraharam.audit;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Auditable {
    String action();      // e.g., "APPROVE_PAYMENT"
    String target();      // e.g., "Payment", "User", "Event"
}
