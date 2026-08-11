package com.restfulApis.CampusFoodApp.dto;

import lombok.Data;

@Data
public class ErrorResponseDTO {

    private int status;
    private String message;
    private String timestamp;
}