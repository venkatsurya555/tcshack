package com.foodfeedback.ai.repository;

import com.foodfeedback.ai.model.ComplaintGroup;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComplaintGroupRepository extends MongoRepository<ComplaintGroup, String> {
    Optional<ComplaintGroup> findByLabel(String label);
}
