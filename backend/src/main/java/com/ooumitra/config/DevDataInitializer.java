package com.ooumitra.config;

import com.ooumitra.entity.*;
import com.ooumitra.enums.*;
import com.ooumitra.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevDataInitializer implements CommandLineRunner {

    private static final String ADMIN_MOBILE = "9000000000";
    private static final String ADMIN_OTP    = "123456";

    private final UserRepository               userRepo;
    private final OtpVerificationRepository    otpRepo;
    private final ProductRepository            productRepo;
    private final WorkerListingRepository      workerRepo;
    private final TransportListingRepository   transportRepo;
    private final VehicleWorkListingRepository vehicleWorkRepo;

    @Override
    public void run(String... args) {
        User admin = seedAdmin();
        List<User> users = seedUsers();

        seedOtp();
        seedProducts(admin, users);
        seedWorkers(admin, users);
        seedTransport(admin, users);
        seedVehicleWork(admin, users);

        log.info("");
        log.info("══════════════════════════════════════════════════");
        log.info("  DEV ADMIN CREDENTIALS");
        log.info("  Mobile : {}", ADMIN_MOBILE);
        log.info("  OTP    : {}  (valid 24 h, reseeded every restart)", ADMIN_OTP);
        log.info("  POST /api/auth/login  {{ \"mobileNumber\": \"{}\", \"otp\": \"{}\" }}", ADMIN_MOBILE, ADMIN_OTP);
        log.info("  Swagger : http://localhost:8080/swagger-ui.html");
        log.info("  H2 DB   : http://localhost:8080/h2-console  (JDBC URL above)");
        log.info("══════════════════════════════════════════════════");
        log.info("");
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    private User seedAdmin() {
        return userRepo.findByMobileNumber(ADMIN_MOBILE).orElseGet(() -> {
            User admin = User.builder()
                    .firstName("Admin").lastName("OoruMitra")
                    .mobileNumber(ADMIN_MOBILE)
                    .role(Role.ADMIN)
                    .isVerified(true).isActive(true)
                    .village("Headquarters")
                    .build();
            return userRepo.save(admin);
        });
    }

    private void seedOtp() {
        OtpVerification otp = OtpVerification.builder()
                .mobileNumber(ADMIN_MOBILE)
                .otp(ADMIN_OTP)
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .build();
        otpRepo.save(otp);
    }

    // ── Extra users ────────────────────────────────────────────────────────

    private List<User> seedUsers() {
        String[][] usersData = {
            {"Ramu",    "Reddy",   "9111111111", "Anantapur"},
            {"Lakshmi", "Devi",    "9222222222", "Kurnool"},
            {"Venkat",  "Rao",     "9333333333", "Nellore"},
            {"Sujatha", "Kumari",  "9444444444", "Guntur"},
            {"Mallesh", "Goud",    "9555555555", "Warangal"},
        };
        return java.util.Arrays.stream(usersData).map(d ->
            userRepo.findByMobileNumber(d[2]).orElseGet(() ->
                userRepo.save(User.builder()
                    .firstName(d[0]).lastName(d[1])
                    .mobileNumber(d[2])
                    .role(Role.BUYER)
                    .isVerified(true).isActive(true)
                    .village(d[3])
                    .build())
            )
        ).toList();
    }

    // ── Products ───────────────────────────────────────────────────────────

    private void seedProducts(User admin, List<User> users) {
        if (productRepo.count() > 0) return;

        productRepo.saveAll(List.of(
            Product.builder()
                .user(users.get(0))
                .productName("Rice (Sona Masuri) — 50 kg bag")
                .category(ProductCategory.AGRICULTURE)
                .subCategory("Grains").ownerName("Ramu Reddy")
                .mobileNumber("9111111111").amount(new BigDecimal("2200"))
                .negotiable(true).location("Anantapur, AP")
                .latitude(new BigDecimal("14.6819")).longitude(new BigDecimal("77.6006"))
                .availability("In stock").description("Fresh harvest Sona Masuri rice. Stored in dry conditions. 50 kg bags available.")
                .averageRating(new BigDecimal("4.5")).ratingCount(12)
                .build(),

            Product.builder()
                .user(users.get(1))
                .productName("Red Chilli (Teja) — 10 kg")
                .category(ProductCategory.AGRICULTURE)
                .subCategory("Spices").ownerName("Lakshmi Devi")
                .mobileNumber("9222222222").amount(new BigDecimal("1800"))
                .negotiable(true).location("Kurnool, AP")
                .latitude(new BigDecimal("15.8281")).longitude(new BigDecimal("78.0373"))
                .availability("Available now").description("High quality Teja variety red chilli. Dry, clean, no moisture.")
                .averageRating(new BigDecimal("4.2")).ratingCount(8)
                .build(),

            Product.builder()
                .user(users.get(2))
                .productName("Mahindra Tractor (575 DI) — 2018")
                .category(ProductCategory.VEHICLES)
                .subCategory("Tractor").ownerName("Venkat Rao")
                .mobileNumber("9333333333").amount(new BigDecimal("485000"))
                .negotiable(true).location("Nellore, AP")
                .latitude(new BigDecimal("14.4426")).longitude(new BigDecimal("79.9865"))
                .availability("For sale").description("Used Mahindra 575 DI, 2018 model. 1200 hours run. Good condition, all papers clear.")
                .averageRating(new BigDecimal("4.0")).ratingCount(3)
                .build(),

            Product.builder()
                .user(users.get(3))
                .productName("Murrah Buffalo — Dairy")
                .category(ProductCategory.LIVESTOCK)
                .subCategory("Buffalo").ownerName("Sujatha Kumari")
                .mobileNumber("9444444444").amount(new BigDecimal("65000"))
                .negotiable(true).location("Guntur, AP")
                .latitude(new BigDecimal("16.3067")).longitude(new BigDecimal("80.4365"))
                .availability("Available").description("Murrah buffalo, 5 years old, gives 12 litres/day. Healthy, vaccinated, good temperament.")
                .averageRating(new BigDecimal("4.8")).ratingCount(5)
                .build(),

            Product.builder()
                .user(users.get(4))
                .productName("Sprayer Pump — 16L Knapsack")
                .category(ProductCategory.HARDWARE)
                .subCategory("Farm Equipment").ownerName("Mallesh Goud")
                .mobileNumber("9555555555").amount(new BigDecimal("3500"))
                .negotiable(false).location("Warangal, TS")
                .latitude(new BigDecimal("17.9784")).longitude(new BigDecimal("79.5941"))
                .availability("In stock (3 units)").description("Battery-powered 16L knapsack sprayer. 2 years warranty. Good for pesticide application.")
                .averageRating(new BigDecimal("4.3")).ratingCount(17)
                .build(),

            Product.builder()
                .user(admin)
                .productName("Groundnut Seeds — Certified (20 kg)")
                .category(ProductCategory.AGRICULTURE)
                .subCategory("Seeds").ownerName("Admin OoruMitra")
                .mobileNumber("9000000000").amount(new BigDecimal("1600"))
                .negotiable(false).location("Headquarters")
                .availability("Available").description("Certified groundnut seeds, high germination rate. Suitable for kharif season.")
                .averageRating(new BigDecimal("4.6")).ratingCount(22)
                .build(),

            Product.builder()
                .user(users.get(0))
                .productName("Desi Cow — A2 Milk")
                .category(ProductCategory.LIVESTOCK)
                .subCategory("Cow").ownerName("Ramu Reddy")
                .mobileNumber("9111111111").amount(new BigDecimal("42000"))
                .negotiable(true).location("Anantapur, AP")
                .latitude(new BigDecimal("14.6819")).longitude(new BigDecimal("77.6006"))
                .availability("Available").description("Desi Gir cow, 4 years old, 8 litres/day A2 milk. Fully vaccinated, healthy.")
                .averageRating(new BigDecimal("4.7")).ratingCount(9)
                .build(),

            Product.builder()
                .user(users.get(1))
                .productName("MS Angle & Channel — 6m lengths")
                .category(ProductCategory.HARDWARE)
                .subCategory("Steel").ownerName("Lakshmi Devi")
                .mobileNumber("9222222222").amount(new BigDecimal("280"))
                .negotiable(true).location("Kurnool, AP")
                .latitude(new BigDecimal("15.8281")).longitude(new BigDecimal("78.0373"))
                .availability("Per kg basis").description("MS angle iron and channels, 6 metre lengths. Used in shed and gate construction. ₹280/kg.")
                .averageRating(BigDecimal.ZERO).ratingCount(0)
                .build()
        ));
    }

    // ── Workers ────────────────────────────────────────────────────────────

    private void seedWorkers(User admin, List<User> users) {
        if (workerRepo.count() > 0) return;

        workerRepo.saveAll(List.of(
            WorkerListing.builder()
                .user(users.get(0))
                .groupName("Ramu Harvesting Group").ownerName("Ramu Reddy")
                .mobileNumber("9111111111").village("Anantapur")
                .availableWorkers(15).priceType(PriceType.ACRE)
                .amount(new BigDecimal("2500")).workType(WorkType.HARVESTING)
                .latitude(new BigDecimal("14.6819")).longitude(new BigDecimal("77.6006"))
                .averageRating(new BigDecimal("4.6")).ratingCount(18)
                .build(),

            WorkerListing.builder()
                .user(users.get(1))
                .groupName("Lakshmi Construction Team").ownerName("Lakshmi Devi")
                .mobileNumber("9222222222").village("Kurnool")
                .availableWorkers(8).priceType(PriceType.HOUR)
                .amount(new BigDecimal("350")).workType(WorkType.CONSTRUCTION)
                .latitude(new BigDecimal("15.8281")).longitude(new BigDecimal("78.0373"))
                .averageRating(new BigDecimal("4.3")).ratingCount(11)
                .build(),

            WorkerListing.builder()
                .user(users.get(2))
                .groupName("Venkat Electricals").ownerName("Venkat Rao")
                .mobileNumber("9333333333").village("Nellore")
                .availableWorkers(3).priceType(PriceType.HOUR)
                .amount(new BigDecimal("500")).workType(WorkType.ELECTRICAL)
                .latitude(new BigDecimal("14.4426")).longitude(new BigDecimal("79.9865"))
                .averageRating(new BigDecimal("4.8")).ratingCount(34)
                .build(),

            WorkerListing.builder()
                .user(users.get(3))
                .groupName("Sujatha Planting Group").ownerName("Sujatha Kumari")
                .mobileNumber("9444444444").village("Guntur")
                .availableWorkers(20).priceType(PriceType.ACRE)
                .amount(new BigDecimal("1800")).workType(WorkType.PLANTING)
                .latitude(new BigDecimal("16.3067")).longitude(new BigDecimal("80.4365"))
                .averageRating(new BigDecimal("4.4")).ratingCount(7)
                .build(),

            WorkerListing.builder()
                .user(users.get(4))
                .groupName("Mallesh Painters").ownerName("Mallesh Goud")
                .mobileNumber("9555555555").village("Warangal")
                .availableWorkers(5).priceType(PriceType.HOUR)
                .amount(new BigDecimal("400")).workType(WorkType.PAINTING)
                .latitude(new BigDecimal("17.9784")).longitude(new BigDecimal("79.5941"))
                .averageRating(new BigDecimal("4.1")).ratingCount(6)
                .build(),

            WorkerListing.builder()
                .user(admin)
                .groupName("OoruMitra Loading Squad").ownerName("Admin OoruMitra")
                .mobileNumber("9000000000").village("Headquarters")
                .availableWorkers(10).priceType(PriceType.HOUR)
                .amount(new BigDecimal("250")).workType(WorkType.LOADING_UNLOADING)
                .averageRating(new BigDecimal("4.0")).ratingCount(4)
                .build()
        ));
    }

    // ── Transport ──────────────────────────────────────────────────────────

    private void seedTransport(User admin, List<User> users) {
        if (transportRepo.count() > 0) return;

        transportRepo.saveAll(List.of(
            TransportListing.builder()
                .user(users.get(0))
                .vehicleType(TransportVehicleType.TRACTOR)
                .ownerName("Ramu Reddy").mobileNumber("9111111111")
                .ratePerHour(new BigDecimal("500")).weightCapacity("3 Tonnes")
                .negotiable(true).availability("Mon–Sat, 6AM–6PM")
                .latitude(new BigDecimal("14.6819")).longitude(new BigDecimal("77.6006"))
                .averageRating(new BigDecimal("4.5")).ratingCount(14)
                .build(),

            TransportListing.builder()
                .user(users.get(1))
                .vehicleType(TransportVehicleType.MINI_TRUCK)
                .ownerName("Lakshmi Devi").mobileNumber("9222222222")
                .ratePerKm(new BigDecimal("18")).weightCapacity("2 Tonnes")
                .negotiable(false).availability("Available 24/7")
                .latitude(new BigDecimal("15.8281")).longitude(new BigDecimal("78.0373"))
                .averageRating(new BigDecimal("4.2")).ratingCount(9)
                .build(),

            TransportListing.builder()
                .user(users.get(2))
                .vehicleType(TransportVehicleType.LORRY)
                .ownerName("Venkat Rao").mobileNumber("9333333333")
                .ratePerKm(new BigDecimal("25")).ratePerHour(new BigDecimal("900"))
                .weightCapacity("10 Tonnes")
                .negotiable(true).availability("Mon–Sat, 7AM–8PM")
                .latitude(new BigDecimal("14.4426")).longitude(new BigDecimal("79.9865"))
                .averageRating(new BigDecimal("4.7")).ratingCount(21)
                .build(),

            TransportListing.builder()
                .user(users.get(3))
                .vehicleType(TransportVehicleType.AUTO)
                .ownerName("Sujatha Kumari").mobileNumber("9444444444")
                .ratePerKm(new BigDecimal("12")).weightCapacity("300 kg")
                .negotiable(false).availability("6AM–9PM daily")
                .latitude(new BigDecimal("16.3067")).longitude(new BigDecimal("80.4365"))
                .averageRating(new BigDecimal("4.0")).ratingCount(5)
                .build(),

            TransportListing.builder()
                .user(users.get(4))
                .vehicleType(TransportVehicleType.MINI_TRUCK)
                .ownerName("Mallesh Goud").mobileNumber("9555555555")
                .ratePerKm(new BigDecimal("15")).ratePerHour(new BigDecimal("600"))
                .weightCapacity("1.5 Tonnes")
                .negotiable(true).availability("Available on call")
                .latitude(new BigDecimal("17.9784")).longitude(new BigDecimal("79.5941"))
                .averageRating(BigDecimal.ZERO).ratingCount(0)
                .build()
        ));
    }

    // ── Vehicle Work ───────────────────────────────────────────────────────

    private void seedVehicleWork(User admin, List<User> users) {
        if (vehicleWorkRepo.count() > 0) return;

        vehicleWorkRepo.saveAll(List.of(
            VehicleWorkListing.builder()
                .user(users.get(0))
                .vehicleType(VehicleWorkType.TRACTOR)
                .ownerName("Ramu Reddy").mobileNumber("9111111111")
                .pricePerAcre(new BigDecimal("1200")).pricePerHour(new BigDecimal("600"))
                .village("Anantapur").availableStatus(true)
                .availableUntil(LocalDate.now().plusMonths(2))
                .latitude(new BigDecimal("14.6819")).longitude(new BigDecimal("77.6006"))
                .averageRating(new BigDecimal("4.6")).ratingCount(19)
                .build(),

            VehicleWorkListing.builder()
                .user(users.get(1))
                .vehicleType(VehicleWorkType.HARVESTER)
                .ownerName("Lakshmi Devi").mobileNumber("9222222222")
                .pricePerAcre(new BigDecimal("2500")).pricePerHour(new BigDecimal("1500"))
                .village("Kurnool").availableStatus(true)
                .availableUntil(LocalDate.now().plusWeeks(6))
                .latitude(new BigDecimal("15.8281")).longitude(new BigDecimal("78.0373"))
                .averageRating(new BigDecimal("4.8")).ratingCount(27)
                .build(),

            VehicleWorkListing.builder()
                .user(users.get(2))
                .vehicleType(VehicleWorkType.JCB)
                .ownerName("Venkat Rao").mobileNumber("9333333333")
                .pricePerHour(new BigDecimal("2000"))
                .village("Nellore").availableStatus(true)
                .latitude(new BigDecimal("14.4426")).longitude(new BigDecimal("79.9865"))
                .averageRating(new BigDecimal("4.5")).ratingCount(11)
                .build(),

            VehicleWorkListing.builder()
                .user(users.get(3))
                .vehicleType(VehicleWorkType.BOREWELL_MACHINE)
                .ownerName("Sujatha Kumari").mobileNumber("9444444444")
                .pricePerHour(new BigDecimal("3500"))
                .village("Guntur").availableStatus(false)
                .availableUntil(LocalDate.now().plusWeeks(2))
                .latitude(new BigDecimal("16.3067")).longitude(new BigDecimal("80.4365"))
                .averageRating(new BigDecimal("4.3")).ratingCount(8)
                .build(),

            VehicleWorkListing.builder()
                .user(users.get(4))
                .vehicleType(VehicleWorkType.TRACTOR)
                .ownerName("Mallesh Goud").mobileNumber("9555555555")
                .pricePerAcre(new BigDecimal("1000")).pricePerHour(new BigDecimal("500"))
                .village("Warangal").availableStatus(true)
                .availableUntil(LocalDate.now().plusMonths(3))
                .latitude(new BigDecimal("17.9784")).longitude(new BigDecimal("79.5941"))
                .averageRating(new BigDecimal("4.1")).ratingCount(6)
                .build()
        ));
    }
}
