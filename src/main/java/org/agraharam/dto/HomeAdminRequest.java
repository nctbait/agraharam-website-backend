package org.agraharam.dto;

import java.util.List;

public record HomeAdminRequest(
    List<String> announcements,
    List<String> banners,
    List<HomePageResponse.NewsItem> news,
    List<HomePageResponse.AdItem> ads
) {}