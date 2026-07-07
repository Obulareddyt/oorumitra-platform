package com.ooumitra.provider;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SmsProviderFactory {
    private final ApplicationContext context;

    @Value("${app.sms.provider:msg91Sms}")
    private String activeProviderName;

    public SmsProvider getActiveProvider() {
        try {
            return context.getBean(activeProviderName, SmsProvider.class);
        } catch (Exception e) {
            return context.getBean("msg91Sms", SmsProvider.class);
        }
    }
}
