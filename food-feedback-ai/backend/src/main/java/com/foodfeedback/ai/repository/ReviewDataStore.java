package com.foodfeedback.ai.repository;

import com.foodfeedback.ai.model.ComplaintGroup;
import com.foodfeedback.ai.model.Review;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class ReviewDataStore {

    private static final Logger log = LoggerFactory.getLogger(ReviewDataStore.class);

    private final MongoTemplate mongoTemplate;
    private final boolean isMongoAvailable;

    // Resilient fallback memory store
    private final Map<String, Review> memoryReviews = new ConcurrentHashMap<>();
    private final Map<String, ComplaintGroup> memoryGroups = new ConcurrentHashMap<>();

    @Autowired
    public ReviewDataStore(@Autowired(required = false) MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        boolean available = false;
        if (mongoTemplate != null) {
            try {
                mongoTemplate.executeCommand("{ ping: 1 }");
                available = true;
                log.info("MongoDB connection confirmed active.");
            } catch (Exception e) {
                log.warn("MongoDB daemon not responding ({}); enabling high-performance in-memory fallback store.", e.getMessage());
            }
        }
        this.isMongoAvailable = available;
    }

    public Review saveReview(Review review) {
        if (review.getId() == null || review.getId().isEmpty()) {
            review.setId(UUID.randomUUID().toString());
        }
        review.setUpdatedAt(Instant.now());

        if (isMongoAvailable && mongoTemplate != null) {
            try {
                return mongoTemplate.save(review);
            } catch (Exception e) {
                log.warn("Mongo save failed, falling back to memory store: {}", e.getMessage());
            }
        }
        memoryReviews.put(review.getId(), review);
        return review;
    }

    public List<Review> saveAllReviews(List<Review> reviews) {
        List<Review> saved = new ArrayList<>();
        for (Review r : reviews) {
            saved.add(saveReview(r));
        }
        return saved;
    }

    public Optional<Review> findReviewById(String id) {
        if (isMongoAvailable && mongoTemplate != null) {
            try {
                Review r = mongoTemplate.findById(id, Review.class);
                if (r != null) return Optional.of(r);
            } catch (Exception ignored) {}
        }
        return Optional.ofNullable(memoryReviews.get(id));
    }

    public List<Review> findAllReviews() {
        if (isMongoAvailable && mongoTemplate != null) {
            try {
                return mongoTemplate.findAll(Review.class);
            } catch (Exception ignored) {}
        }
        return new ArrayList<>(memoryReviews.values());
    }

    public Page<Review> findReviewsPaged(String groupId, String sentiment, String search, Pageable pageable) {
        List<Review> all = findAllReviews();
        
        // Filter
        List<Review> filtered = all.stream()
                .filter(r -> groupId == null || groupId.isEmpty() || groupId.equalsIgnoreCase(r.getGroupId()))
                .filter(r -> sentiment == null || sentiment.isEmpty() || sentiment.equalsIgnoreCase(r.getSentiment()))
                .filter(r -> search == null || search.isEmpty() || (r.getText() != null && r.getText().toLowerCase().contains(search.toLowerCase())))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<Review> pageContent = start > filtered.size() ? Collections.emptyList() : filtered.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    public List<Review> findReviewsByGroupId(String groupId) {
        return findAllReviews().stream()
                .filter(r -> groupId.equals(r.getGroupId()))
                .collect(Collectors.toList());
    }

    public ComplaintGroup saveGroup(ComplaintGroup group) {
        if (group.getId() == null || group.getId().isEmpty()) {
            group.setId(UUID.randomUUID().toString());
        }
        group.setUpdatedAt(Instant.now());

        if (isMongoAvailable && mongoTemplate != null) {
            try {
                return mongoTemplate.save(group);
            } catch (Exception e) {
                log.warn("Mongo save group failed: {}", e.getMessage());
            }
        }
        memoryGroups.put(group.getId(), group);
        return group;
    }

    public List<ComplaintGroup> saveAllGroups(List<ComplaintGroup> groups) {
        List<ComplaintGroup> saved = new ArrayList<>();
        for (ComplaintGroup g : groups) {
            saved.add(saveGroup(g));
        }
        return saved;
    }

    public Optional<ComplaintGroup> findGroupById(String id) {
        if (isMongoAvailable && mongoTemplate != null) {
            try {
                ComplaintGroup g = mongoTemplate.findById(id, ComplaintGroup.class);
                if (g != null) return Optional.of(g);
            } catch (Exception ignored) {}
        }
        return Optional.ofNullable(memoryGroups.get(id));
    }

    public List<ComplaintGroup> findAllGroups() {
        if (isMongoAvailable && mongoTemplate != null) {
            try {
                return mongoTemplate.findAll(ComplaintGroup.class);
            } catch (Exception ignored) {}
        }
        return new ArrayList<>(memoryGroups.values());
    }

    public void clearAllGroups() {
        if (isMongoAvailable && mongoTemplate != null) {
            try {
                mongoTemplate.dropCollection(ComplaintGroup.class);
            } catch (Exception ignored) {}
        }
        memoryGroups.clear();
    }

    public void deleteAllGroups() {
        clearAllGroups();
    }

    public long countReviews() {
        return findAllReviews().size();
    }
}
