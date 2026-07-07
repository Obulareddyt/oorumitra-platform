package com.ooumitra.provider;

public interface SmsProvider {
    void sendSms(String mobileNumber, String message);
}
