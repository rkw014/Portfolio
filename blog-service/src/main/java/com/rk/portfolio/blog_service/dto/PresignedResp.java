package com.rk.portfolio.blog_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PresignedResp {
    private String presignedUrl;
    private String publicUrl;
}
