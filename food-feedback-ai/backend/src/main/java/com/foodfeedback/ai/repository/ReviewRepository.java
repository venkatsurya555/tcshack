package com.foodfeedback.ai.repository;

import com.foodfeedback.ai.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByGroupId(String groupId);
    Page<Review> findByGroupId(String groupId, Pageable pageable);
    Page<Review> findBySentiment(String sentiment, Pageable pageable);
    long countBySentiment(String sentiment);
    long countByGroupId(String groupId);
}
