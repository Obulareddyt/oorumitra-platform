package com.ooumitra.service;

import com.ooumitra.dto.response.AdminPendingResponse;
import com.ooumitra.dto.response.ProductResponse;
import com.ooumitra.dto.response.TransportResponse;
import com.ooumitra.dto.response.VehicleWorkResponse;
import com.ooumitra.dto.response.WorkerListingResponse;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductRepository productRepo;
    private final WorkerListingRepository workerRepo;
    private final TransportListingRepository transportRepo;
    private final VehicleWorkListingRepository vehicleWorkRepo;

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

    @Transactional
    public ProductResponse decideProduct(Long id, ApprovalStatus decision) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Product"));
        product.setApprovalStatus(decision);
        return ProductResponse.from(productRepo.save(product));
    }

    @Transactional
    public WorkerListingResponse decideWorker(Long id, ApprovalStatus decision) {
        WorkerListing listing = workerRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Worker listing"));
        listing.setApprovalStatus(decision);
        return WorkerListingResponse.from(workerRepo.save(listing));
    }

    @Transactional
    public TransportResponse decideTransport(Long id, ApprovalStatus decision) {
        TransportListing listing = transportRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Transport listing"));
        listing.setApprovalStatus(decision);
        return TransportResponse.from(transportRepo.save(listing));
    }

    @Transactional
    public VehicleWorkResponse decideVehicleWork(Long id, ApprovalStatus decision) {
        VehicleWorkListing listing = vehicleWorkRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Vehicle work listing"));
        listing.setApprovalStatus(decision);
        return VehicleWorkResponse.from(vehicleWorkRepo.save(listing));
    }
}
