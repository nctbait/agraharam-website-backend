package org.agraharam.pojo;

import org.agraharam.enums.AccessRole;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    @NotNull
    private AccessRole role;
}
