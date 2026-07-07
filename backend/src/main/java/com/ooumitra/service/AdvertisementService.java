package com.ooumitra.service;

import com.ooumitra.dto.request.AdvertisementRequest;
import com.ooumitra.dto.response.AdvertisementResponse;
import com.ooumitra.entity.Advertisement;
import com.ooumitra.entity.AdvertisementMedia;
import com.ooumitra.entity.AdvertisementSchedule;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.AdvertisementMediaRepository;
import com.ooumitra.repository.AdvertisementRepository;
import com.ooumitra.repository.AdvertisementScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdvertisementService {

    private final AdvertisementRepository adRepo;
    private final AdvertisementMediaRepository adMediaRepo;
    private final AdvertisementScheduleRepository adScheduleRepo;
    private final S3Service s3Service;

    @Transactional(readOnly = true)
    public List<AdvertisementResponse> getActiveAdvertisements(String adType) {
        LocalDate today = LocalDate.now();
        List<Advertisement> ads;
        if (adType != null && !adType.isBlank()) {
            ads = adRepo.findActiveAdvertisementsByType(adType.toUpperCase(), today);
        } else {
            ads = adRepo.findActiveAdvertisements(today);
        }

        List<AdvertisementResponse> responseList = new ArrayList<>();
        for (Advertisement ad : ads) {
            List<AdvertisementSchedule> schedules = adScheduleRepo.findByAdvertisementId(ad.getId());
            LocalTime startTime = null;
            LocalTime endTime = null;
            String dayOfWeek = null;
            if (!schedules.isEmpty()) {
                AdvertisementSchedule s = schedules.get(0);
                startTime = s.getStartTime();
                endTime = s.getEndTime();
                dayOfWeek = s.getDayOfWeek();
            }
            responseList.add(AdvertisementResponse.from(ad, startTime, endTime, dayOfWeek));
        }
        return responseList;
    }

    @Transactional(readOnly = true)
    public List<AdvertisementResponse> getAllAdvertisements() {
        List<Advertisement> ads = adRepo.findAllByOrderByPriorityDesc();
        List<AdvertisementResponse> responseList = new ArrayList<>();
        for (Advertisement ad : ads) {
            List<AdvertisementSchedule> schedules = adScheduleRepo.findByAdvertisementId(ad.getId());
            LocalTime startTime = null;
            LocalTime endTime = null;
            String dayOfWeek = null;
            if (!schedules.isEmpty()) {
                AdvertisementSchedule s = schedules.get(0);
                startTime = s.getStartTime();
                endTime = s.getEndTime();
                dayOfWeek = s.getDayOfWeek();
            }
            responseList.add(AdvertisementResponse.from(ad, startTime, endTime, dayOfWeek));
        }
        return responseList;
    }

    @Transactional
    public AdvertisementResponse createAdvertisement(AdvertisementRequest req, MultipartFile mediaFile) throws IOException {
        String mediaUrl = null;
        if (mediaFile != null && !mediaFile.isEmpty()) {
            mediaUrl = s3Service.uploadFile(mediaFile, "advertisements");
        }

        Advertisement ad = Advertisement.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .mediaUrl(mediaUrl)
                .mediaType(req.getMediaType() != null ? req.getMediaType().toUpperCase() : "IMAGE")
                .redirectUrl(req.getRedirectUrl())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .priority(req.getPriority())
                .status(req.getStatus() != null ? req.getStatus().toUpperCase() : "ACTIVE")
                .adType(req.getAdType() != null ? req.getAdType().toUpperCase() : "BANNER")
                .build();

        ad = adRepo.save(ad);

        // Save media list
        if (mediaUrl != null) {
            AdvertisementMedia adMedia = AdvertisementMedia.builder()
                    .advertisement(ad)
                    .mediaUrl(mediaUrl)
                    .mediaType(ad.getMediaType())
                    .build();
            adMediaRepo.save(adMedia);
        }

        // Save optional schedule
        if (req.getStartTime() != null || req.getEndTime() != null || req.getDayOfWeek() != null) {
            AdvertisementSchedule schedule = AdvertisementSchedule.builder()
                    .advertisement(ad)
                    .startTime(req.getStartTime())
                    .endTime(req.getEndTime())
                    .dayOfWeek(req.getDayOfWeek())
                    .build();
            adScheduleRepo.save(schedule);
        }

        return AdvertisementResponse.from(ad, req.getStartTime(), req.getEndTime(), req.getDayOfWeek());
    }

    @Transactional
    public AdvertisementResponse updateAdvertisement(Long id, AdvertisementRequest req, MultipartFile mediaFile) throws IOException {
        Advertisement ad = adRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Advertisement not found"));

        ad.setTitle(req.getTitle());
        ad.setDescription(req.getDescription());
        ad.setRedirectUrl(req.getRedirectUrl());
        ad.setStartDate(req.getStartDate());
        ad.setEndDate(req.getEndDate());
        ad.setPriority(req.getPriority());
        if (req.getStatus() != null) {
            ad.setStatus(req.getStatus().toUpperCase());
        }
        if (req.getAdType() != null) {
            ad.setAdType(req.getAdType().toUpperCase());
        }

        if (mediaFile != null && !mediaFile.isEmpty()) {
            String mediaUrl = s3Service.uploadFile(mediaFile, "advertisements");
            ad.setMediaUrl(mediaUrl);
            ad.setMediaType(req.getMediaType() != null ? req.getMediaType().toUpperCase() : "IMAGE");

            // Update media table
            adMediaRepo.deleteByAdvertisementId(ad.getId());
            AdvertisementMedia adMedia = AdvertisementMedia.builder()
                    .advertisement(ad)
                    .mediaUrl(mediaUrl)
                    .mediaType(ad.getMediaType())
                    .build();
            adMediaRepo.save(adMedia);
        } else if (req.getMediaType() != null) {
            ad.setMediaType(req.getMediaType().toUpperCase());
        }

        ad = adRepo.save(ad);

        // Update schedule
        adScheduleRepo.deleteByAdvertisementId(ad.getId());
        if (req.getStartTime() != null || req.getEndTime() != null || req.getDayOfWeek() != null) {
            AdvertisementSchedule schedule = AdvertisementSchedule.builder()
                    .advertisement(ad)
                    .startTime(req.getStartTime())
                    .endTime(req.getEndTime())
                    .dayOfWeek(req.getDayOfWeek())
                    .build();
            adScheduleRepo.save(schedule);
        }

        return AdvertisementResponse.from(ad, req.getStartTime(), req.getEndTime(), req.getDayOfWeek());
    }

    @Transactional
    public void deleteAdvertisement(Long id) {
        if (!adRepo.existsById(id)) {
            throw OoruMitraException.notFound("Advertisement not found");
        }
        adRepo.deleteById(id);
    }
}
