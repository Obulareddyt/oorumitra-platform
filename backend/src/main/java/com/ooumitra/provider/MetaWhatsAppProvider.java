package com.ooumitra.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("metaWhatsApp")
@Slf4j
public class MetaWhatsAppProvider implements WhatsAppProvider {
    @Override
    public void sendWhatsAppMessage(String mobileNumber, String message) {
        log.info("[WA-META] Dispatching WhatsApp message via Meta API to {}: {}", mobileNumber, message);
    }
}
