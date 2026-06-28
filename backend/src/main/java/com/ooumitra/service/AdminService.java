package com.ooumitra.service;

import com.ooumitra.dto.response.*;
import com.ooumitra.entity.Product;
import com.ooumitra.entity.TransportListing;
import com.ooumitra.entity.VehicleWorkListing;
import com.ooumitra.entity.WorkerListing;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.ProductRepository;
import com.ooumitra.repository.TransportListingRepository;
import com.ooumitra.repository.VehicleWorkListingRepository;
import com.ooumitra.repository.WorkerListingRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductRepository productRepo;
    private final WorkerListingRepository workerRepo;
    private final TransportListingRepository transportRepo;
    private final VehicleWorkListingRepository vehicleWorkRepo;
    private final SmsService smsService;

    @Transactional(readOnly = true)
    public AdminPendingResponse getPending() {
        return AdminPendingResponse.builder()
                .products(productRepo.findByApprovalStatus(ApprovalStatus.PENDING).stream()
                        .map(ProductResponse::from).toList())
                .workers(workerRepo.findByApprovalStatus(ApprovalStatus.PENDING).stream()
                        .map(WorkerListingResponse::from).toList())
                .transport(transportRepo.findByApprovalStatus(ApprovalStatus.PENDING).stream()
                        .map(TransportResponse::from).toList())
                .vehicleWork(vehicleWorkRepo.findByApprovalStatus(ApprovalStatus.PENDING).stream()
                        .map(VehicleWorkResponse::from).toList())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalProducts  = productRepo.count();
        long totalWorkers   = workerRepo.count();
        long totalTransport = transportRepo.count();
        long totalVehicle   = vehicleWorkRepo.count();

        long pendP = productRepo.countByApprovalStatus(ApprovalStatus.PENDING);
        long pendW = workerRepo.countByApprovalStatus(ApprovalStatus.PENDING);
        long pendT = transportRepo.countByApprovalStatus(ApprovalStatus.PENDING);
        long pendV = vehicleWorkRepo.countByApprovalStatus(ApprovalStatus.PENDING);

        long appP = productRepo.countByApprovalStatus(ApprovalStatus.APPROVED);
        long appW = workerRepo.countByApprovalStatus(ApprovalStatus.APPROVED);
        long appT = transportRepo.countByApprovalStatus(ApprovalStatus.APPROVED);
        long appV = vehicleWorkRepo.countByApprovalStatus(ApprovalStatus.APPROVED);

        long rejP = productRepo.countByApprovalStatus(ApprovalStatus.REJECTED);
        long rejW = workerRepo.countByApprovalStatus(ApprovalStatus.REJECTED);
        long rejT = transportRepo.countByApprovalStatus(ApprovalStatus.REJECTED);
        long rejV = vehicleWorkRepo.countByApprovalStatus(ApprovalStatus.REJECTED);

        return AdminStatsResponse.builder()
                .totalPosts(totalProducts + totalWorkers + totalTransport + totalVehicle)
                .totalPending(pendP + pendW + pendT + pendV)
                .totalApproved(appP + appW + appT + appV)
                .totalRejected(rejP + rejW + rejT + rejV)
                .totalProducts(totalProducts).pendingProducts(pendP).approvedProducts(appP).rejectedProducts(rejP)
                .totalWorkers(totalWorkers).pendingWorkers(pendW).approvedWorkers(appW).rejectedWorkers(rejW)
                .totalTransport(totalTransport).pendingTransport(pendT).approvedTransport(appT).rejectedTransport(rejT)
                .totalVehicleWork(totalVehicle).pendingVehicleWork(pendV).approvedVehicleWork(appV).rejectedVehicleWork(rejV)
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getProducts(ApprovalStatus status, int page, int size) {
        PageRequest pr = PageRequest.of(page, size <= 0 ? 20 : size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> result = status != null
                ? productRepo.findAllByApprovalStatus(status, pr)
                : productRepo.findAll(pr);
        return new PagedResponse<>(result.getContent().stream().map(ProductResponse::from).toList(),
                result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public PagedResponse<WorkerListingResponse> getWorkers(ApprovalStatus status, int page, int size) {
        PageRequest pr = PageRequest.of(page, size <= 0 ? 20 : size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<WorkerListing> result = status != null
                ? workerRepo.findAllByApprovalStatus(status, pr)
                : workerRepo.findAll(pr);
        return new PagedResponse<>(result.getContent().stream().map(WorkerListingResponse::from).toList(),
                result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public PagedResponse<TransportResponse> getTransport(ApprovalStatus status, int page, int size) {
        PageRequest pr = PageRequest.of(page, size <= 0 ? 20 : size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TransportListing> result = status != null
                ? transportRepo.findAllByApprovalStatus(status, pr)
                : transportRepo.findAll(pr);
        return new PagedResponse<>(result.getContent().stream().map(TransportResponse::from).toList(),
                result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public PagedResponse<VehicleWorkResponse> getVehicleWork(ApprovalStatus status, int page, int size) {
        PageRequest pr = PageRequest.of(page, size <= 0 ? 20 : size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<VehicleWorkListing> result = status != null
                ? vehicleWorkRepo.findAllByApprovalStatus(status, pr)
                : vehicleWorkRepo.findAll(pr);
        return new PagedResponse<>(result.getContent().stream().map(VehicleWorkResponse::from).toList(),
                result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public ProductResponse decideProduct(Long id, ApprovalStatus decision, String remarks) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Product"));
        String adminName = SecurityUtils.currentUser().getFirstName();
        product.setApprovalStatus(decision);
        product.setAdminRemarks(remarks);
        product.setDecidedAt(Instant.now());
        product.setDecidedBy(adminName);
        Product saved = productRepo.save(product);
        smsService.sendApprovalNotification(
                saved.getMobileNumber(), saved.getOwnerName(),
                saved.getProductName(), decision.name(), remarks);
        return ProductResponse.from(saved);
    }

    @Transactional
    public WorkerListingResponse decideWorker(Long id, ApprovalStatus decision, String remarks) {
        WorkerListing listing = workerRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Worker listing"));
        String adminName = SecurityUtils.currentUser().getFirstName();
        listing.setApprovalStatus(decision);
        listing.setAdminRemarks(remarks);
        listing.setDecidedAt(Instant.now());
        listing.setDecidedBy(adminName);
        WorkerListing saved = workerRepo.save(listing);
        smsService.sendApprovalNotification(
                saved.getMobileNumber(), saved.getOwnerName(),
                saved.getGroupName(), decision.name(), remarks);
        return WorkerListingResponse.from(saved);
    }

    @Transactional
    public TransportResponse decideTransport(Long id, ApprovalStatus decision, String remarks) {
        TransportListing listing = transportRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Transport listing"));
        String adminName = SecurityUtils.currentUser().getFirstName();
        listing.setApprovalStatus(decision);
        listing.setAdminRemarks(remarks);
        listing.setDecidedAt(Instant.now());
        listing.setDecidedBy(adminName);
        TransportListing saved = transportRepo.save(listing);
        smsService.sendApprovalNotification(
                saved.getMobileNumber(), saved.getOwnerName(),
                saved.getVehicleType().name(), decision.name(), remarks);
        return TransportResponse.from(saved);
    }

    @Transactional
    public VehicleWorkResponse decideVehicleWork(Long id, ApprovalStatus decision, String remarks) {
        VehicleWorkListing listing = vehicleWorkRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Vehicle work listing"));
        String adminName = SecurityUtils.currentUser().getFirstName();
        listing.setApprovalStatus(decision);
        listing.setAdminRemarks(remarks);
        listing.setDecidedAt(Instant.now());
        listing.setDecidedBy(adminName);
        VehicleWorkListing saved = vehicleWorkRepo.save(listing);
        smsService.sendApprovalNotification(
                saved.getMobileNumber(), saved.getOwnerName(),
                saved.getVehicleType().name(), decision.name(), remarks);
        return VehicleWorkResponse.from(saved);
    }
}
