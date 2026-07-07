package com.ooumitra.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("awsSnsSms")
@Slf4j
public class AwsSnsSmsProvider implements SmsProvider {
    @Override
    public void sendSms(String mobileNumber, String message) {
        log.info("[SMS-AWS-SNS] Dispatching SMS via AWS SNS to {}: {}", mobileNumber, message);
    }
}
