package com.ooumitra.provider;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WhatsAppProviderFactory {
    private final ApplicationContext context;

    @Value("${app.whatsapp.provider:metaWhatsApp}")
    private String activeProviderName;

    public WhatsAppProvider getActiveProvider() {
        try {
            return context.getBean(activeProviderName, WhatsAppProvider.class);
        } catch (Exception e) {
            return context.getBean("metaWhatsApp", WhatsAppProvider.class);
        }
    }
}
