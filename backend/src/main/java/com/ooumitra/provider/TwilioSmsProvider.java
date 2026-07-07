package com.ooumitra.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("twilioSms")
@Slf4j
public class TwilioSmsProvider implements SmsProvider {
    @Override
    public void sendSms(String mobileNumber, String message) {
        log.info("[SMS-TWILIO] Dispatching SMS via Twilio to {}: {}", mobileNumber, message);
    }
}
