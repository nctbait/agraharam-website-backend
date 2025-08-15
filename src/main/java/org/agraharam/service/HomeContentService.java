package org.agraharam.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.agraharam.dto.HomeAdminRequest;
import org.agraharam.dto.HomePageResponse;
import org.agraharam.model.Event;
import org.agraharam.model.HomeSettings;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.HomeSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HomeContentService {
    private final HomeSettingsRepository settingsRepo;
    private final EventRepository eventRepo;
    private final ObjectMapper om;

    public HomeContentService(HomeSettingsRepository settingsRepo, EventRepository eventRepo, ObjectMapper om) {
        this.settingsRepo = settingsRepo;
        this.eventRepo = eventRepo;
        this.om = om;
    }

    @Transactional(readOnly = true)
    public HomePageResponse getPublicHome() {
        var base = readSettings();
        var announcements = readStringArray(base, "announcements");
        var banners = readStringArray(base, "banners");
        var news = readNews(base);
        var ads = readAds(base);

        var nextEventDto = computeNextEvent();
        var mission = readMission(base); // NEW
        return new HomePageResponse(announcements, banners, news, ads, nextEventDto, mission);
    }

    @Transactional(readOnly = true)
    public HomeAdminRequest getAdminHome() {
        var base = readSettings();
        return new HomeAdminRequest(
                readStringArray(base, "announcements"),
                readStringArray(base, "banners"),
                readNews(base),
                readAds(base),
                readMission(base));
    }

    private HomePageResponse.Mission readMission(JsonNode base) {
        var m = base.get("mission");
        if (m == null || !m.isObject())
            return null;
        return new HomePageResponse.Mission(
                text(m, "title"),
                text(m, "body"),
                text(m, "ctaText"),
                text(m, "ctaUrl"));
    }

    @Transactional
    public void saveAdminHome(HomeAdminRequest req, String editorEmail) {
        try {
            var root = om.createObjectNode();
            root.set("announcements", om.valueToTree(req.announcements()));
            root.set("banners", om.valueToTree(req.banners()));
            root.set("news", om.valueToTree(req.news()));
            root.set("ads", om.valueToTree(req.ads()));
            root.set("mission", om.valueToTree(req.mission()));

            var s = settingsRepo.findById(1L).orElseGet(() -> {
                var n = new HomeSettings();
                n.setId(1L);
                return n;
            });
            s.setPayload(om.writeValueAsString(root));
            s.setUpdatedBy(editorEmail);
            settingsRepo.save(s);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save home content", e);
        }
    }

    // --- helpers ---
    private JsonNode readSettings() {
        var s = settingsRepo.findById(1L)
                .orElseThrow(() -> new IllegalStateException("home_settings row missing (id=1)"));
        try {
            return om.readTree(s.getPayload());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<String> readStringArray(JsonNode base, String field) {
        var out = new ArrayList<String>();
        var node = base.get(field);
        if (node != null && node.isArray())
            node.forEach(n -> out.add(n.asText()));
        return out;
    }

    private List<HomePageResponse.NewsItem> readNews(JsonNode base) {
        var list = new ArrayList<HomePageResponse.NewsItem>();
        var node = base.get("news");
        if (node != null && node.isArray()) {
            node.forEach(n -> list.add(new HomePageResponse.NewsItem(
                    text(n, "title"),
                    text(n, "description"),
                    text(n, "image"),
                    text(n, "linkUrl"))));
        }
        return list;
    }

    private List<HomePageResponse.AdItem> readAds(JsonNode base) {
        var list = new ArrayList<HomePageResponse.AdItem>();
        var node = base.get("ads");
        if (node != null && node.isArray()) {
            node.forEach(n -> list.add(new HomePageResponse.AdItem(
                    text(n, "id"),
                    text(n, "imageUrl"),
                    text(n, "label"),
                    text(n, "linkUrl"),
                    text(n, "type"),
                    text(n, "fit"),
                    text(n, "aspectRatio"),
                    text(n, "bg"),
                    intVal(n, "padding"))));
        }
        return list;
    }

    private Integer intVal(JsonNode n, String f) {
        return (n.hasNonNull(f) ? n.get(f).asInt() : null);
    }

    private String text(JsonNode n, String f) {
        return n.hasNonNull(f) ? n.get(f).asText() : null;
    }

    private HomePageResponse.NextEvent computeNextEvent() {
        ZoneId ZONE = ZoneId.of("America/New_York");
        LocalDate today = LocalDate.now(ZONE);
        LocalTime now = LocalTime.now(ZONE);

        var upcoming = eventRepo.findByDateGreaterThanEqualOrderByDateAscTimeAsc(today);

        for (var e : upcoming) {
            // If event is after today, it’s upcoming
            if (e.getDate().isAfter(today)) {
                return mapNextEvent(e);
            }
            // If event is today:
            // - If time is null, treat as end-of-day (still upcoming)
            // - Else include only if start time is later than now
            if (e.getDate().isEqual(today)) {
                if (e.getTime() == null || e.getTime().isAfter(now)) {
                    return mapNextEvent(e);
                }
            }
        }
        return null; // no upcoming event
    }

    private HomePageResponse.NextEvent mapNextEvent(Event e) {
        ZoneId ZONE = ZoneId.of("America/New_York");
        // Build a LocalDateTime for the frontend; if time is null, use 23:59
        LocalTime t = (e.getTime() != null) ? e.getTime() : LocalTime.of(23, 59);
        LocalDateTime ldt = LocalDateTime.of(e.getDate(), t);
        OffsetDateTime odt = ldt.atZone(ZONE).toOffsetDateTime();

        // Registration logic (capacity=0 means not open yet)
        boolean registrationOpen = (e.getCapacity() != null && e.getCapacity() > 0)
                && (e.getRegistrationDeadline() == null || !LocalDate.now(ZONE).isAfter(e.getRegistrationDeadline()));

        // We’ll always provide a details/registration URL; your frontend already links
        // to /event/{id}
        String ctaUrl = "/event/" + e.getId();

        // If you add a hero image later, map it here; for now null
        String imageUrl = null;

        // NOTE: HomePageResponse.NextEvent has 'name' for frontend compatibility; map
        // from your 'title'
        return new HomePageResponse.NextEvent(
                e.getId(),
                e.getTitle(), // name
                odt, // date (as ISO datetime string)
                ctaUrl,
                imageUrl);
    }
}
