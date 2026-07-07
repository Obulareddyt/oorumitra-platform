package com.ooumitra.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("twilioWhatsApp")
@Slf4j
public class TwilioWhatsAppProvider implements WhatsAppProvider {
    @Override
    public void sendWhatsAppMessage(String mobileNumber, String message) {
        log.info("[WA-TWILIO] Dispatching WhatsApp message via Twilio API to {}: {}", mobileNumber, message);
    }
}
