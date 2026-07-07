package com.ooumitra.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("msg91WhatsApp")
@Slf4j
public class Msg91WhatsAppProvider implements WhatsAppProvider {
    @Override
    public void sendWhatsAppMessage(String mobileNumber, String message) {
        log.info("[WA-MSG91] Dispatching WhatsApp message via MSG91 API to 91{}: {}", mobileNumber, message);
    }
}
