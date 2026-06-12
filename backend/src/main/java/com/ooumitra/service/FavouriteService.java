package com.ooumitra.service;

import com.ooumitra.dto.request.FavouriteRequest;
import com.ooumitra.dto.response.FavouriteResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.entity.Favourite;
import com.ooumitra.entity.User;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.FavouriteRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepository repo;

    @Value("${app.pagination.default-page-size}")
    private int defaultPageSize;

    @Transactional(readOnly = true)
    public PagedResponse<FavouriteResponse> getFavourites(int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        if (size <= 0) size = defaultPageSize;
        Page<Favourite> result = repo.findByUserId(userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        var content = result.getContent().stream().map(FavouriteResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public FavouriteResponse add(FavouriteRequest req) {
        User user = SecurityUtils.currentUser();
        if (repo.existsByUserIdAndListingTypeAndListingId(user.getId(), req.getListingType(), req.getListingId())) {
            throw OoruMitraException.conflict("Already in favourites");
        }
        Favourite fav = Favourite.builder()
                .user(user)
                .listingType(req.getListingType())
                .listingId(req.getListingId())
                .build();
        return FavouriteResponse.from(repo.save(fav));
    }

    @Transactional
    public void remove(Long id) {
        Long userId = SecurityUtils.currentUserId();
        Favourite fav = repo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Favourite"));
        if (!fav.getUser().getId().equals(userId)) {
            throw OoruMitraException.forbidden("Not your favourite");
        }
        repo.delete(fav);
    }

    public boolean isFavourite(FavouriteRequest req) {
        Long userId = SecurityUtils.currentUserId();
        return repo.existsByUserIdAndListingTypeAndListingId(userId, req.getListingType(), req.getListingId());
    }
}
