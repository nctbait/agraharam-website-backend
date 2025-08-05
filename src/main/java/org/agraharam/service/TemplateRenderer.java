package org.agraharam.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TemplateRenderer {

    public RenderedTemplate render(String template, Map<String, Object> context) {
        String rendered = template;

        for (Map.Entry<String, Object> entry : context.entrySet()) {
            String placeholder = "{" + entry.getKey() + "}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            rendered = rendered.replace(placeholder, value);
        }

        return new RenderedTemplate(rendered);
    }

    public static class RenderedTemplate {
        private final String content;

        public RenderedTemplate(String content) {
            this.content = content;
        }

        public String getContent() {
            return content;
        }
    }
}

