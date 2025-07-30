package org.agraharam.dto;

import java.util.List;

import lombok.Data;

@Data
public class IdListRequest {
    private List<Long> ids;
}

