package com.ooumitra.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("msg91Sms")
@Slf4j
public class Msg91SmsProvider implements SmsProvider {
    @Override
    public void sendSms(String mobileNumber, String message) {
        log.info("[SMS-MSG91] Dispatching SMS to 91{}: {}", mobileNumber, message);
    }
}
