package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class Password {

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Lob
    private String hash;

    private Timestamp updatedAt;

    public Password() {
        // required for JPA
    }

    public Password(User user, String hash) {
        this.user = user;
        this.hash = hash;
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
