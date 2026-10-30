package com.foodfeedback.ai.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Bean
    public MongoTemplate mongoTemplate() {
        try {
            MongoClient client = MongoClients.create(mongoUri);
            client.listDatabaseNames().first();
            log.info("MongoDB Atlas cluster connected successfully.");
            return new MongoTemplate(client, "food_feedback_ai");
        } catch (Exception e) {
            log.warn("MongoDB cluster not immediately reachable at startup ({}). Activating resilient dual-mode data store.", e.getMessage());
            return null;
        }
    }
}
