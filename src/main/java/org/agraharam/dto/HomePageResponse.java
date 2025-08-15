package org.agraharam.dto;

import java.time.OffsetDateTime;
import java.util.List;

// dto/HomePageResponse.java
public record HomePageResponse(
    List<String> announcements,
    List<String> banners,
    List<NewsItem> news,
    List<AdItem> ads,
    NextEvent nextEvent,
    Mission mission
) {
  public record NewsItem(String title, String description, String image, String linkUrl) {}

  // NEW fields are nullable and purely presentational
  public record AdItem(
      String id,
      String imageUrl,
      String label,
      String linkUrl,
      String type,        // "logo" | "banner" (optional)
      String fit,         // "contain" | "cover" (optional; default "contain")
      String aspectRatio, // e.g., "3 / 1" | "16 / 9" (optional; default "3 / 1")
      String bg,          // background color behind transparent logos (e.g., "#fff")
      Integer padding     // in px (optional; default 8)
  ) {}

  public record NextEvent(Long id, String name, OffsetDateTime date, String ctaUrl, String imageUrl) {}
  public record Mission(String title, String body, String ctaText, String ctaUrl) {} // NEW
}
