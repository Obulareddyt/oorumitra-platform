package com.ooumitra.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("gupshupWhatsApp")
@Slf4j
public class GupshupWhatsAppProvider implements WhatsAppProvider {
    @Override
    public void sendWhatsAppMessage(String mobileNumber, String message) {
        log.info("[WA-GUPSHUP] Dispatching WhatsApp message via Gupshup to {}: {}", mobileNumber, message);
    }
}
