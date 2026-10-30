package com.foodfeedback.ai.service.nlp;

import com.foodfeedback.ai.dto.AiClusterResponse;
import com.foodfeedback.ai.dto.AiSentimentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class NativeNlpServicesTest {

    private NativeSentimentService sentimentService;
    private NativeEmbeddingService embeddingService;
    private NativeLabelingService labelingService;
    private NativeClusteringService clusteringService;

    @BeforeEach
    public void setup() {
        sentimentService = new NativeSentimentService();
        embeddingService = new NativeEmbeddingService();
        labelingService = new NativeLabelingService();
        clusteringService = new NativeClusteringService(labelingService);
    }

    @Test
    public void testTenSentimentCommentsAudit() {
        // 1. "The food was excellent." -> POSITIVE
        AiSentimentResponse.SentimentItem s1 = sentimentService.analyzeSentiment("The food was excellent.");
        assertEquals("POSITIVE", s1.getSentiment());

        // 2. "The food was terrible." -> NEGATIVE
        AiSentimentResponse.SentimentItem s2 = sentimentService.analyzeSentiment("The food was terrible.");
        assertEquals("NEGATIVE", s2.getSentiment());

        // 3. "The food was not good." -> NEGATIVE (negation inversion)
        AiSentimentResponse.SentimentItem s3 = sentimentService.analyzeSentiment("The food was not good.");
        assertEquals("NEGATIVE", s3.getSentiment());

        // 4. "The food was not bad." -> POSITIVE (negated negative)
        AiSentimentResponse.SentimentItem s4 = sentimentService.analyzeSentiment("The food was not bad.");
        assertEquals("POSITIVE", s4.getSentiment());

        // 5. "The food was good but the service was terrible." -> NEGATIVE (contrastive shift to second clause)
        AiSentimentResponse.SentimentItem s5 = sentimentService.analyzeSentiment("The food was good but the service was terrible.");
        assertEquals("NEGATIVE", s5.getSentiment());

        // 6. "The food was extremely delicious." -> POSITIVE with high confidence due to intensifier
        AiSentimentResponse.SentimentItem s6 = sentimentService.analyzeSentiment("The food was extremely delicious.");
        assertEquals("POSITIVE", s6.getSentiment());
        assertTrue(s6.getConfidence() >= 0.85);

        // 7. "The food was never fresh." -> NEGATIVE (negation inversion)
        AiSentimentResponse.SentimentItem s7 = sentimentService.analyzeSentiment("The food was never fresh.");
        assertEquals("NEGATIVE", s7.getSentiment());

        // 8. "The food arrived on time." -> POSITIVE or NEUTRAL
        AiSentimentResponse.SentimentItem s8 = sentimentService.analyzeSentiment("The food arrived on time.");
        assertNotNull(s8.getSentiment());

        // 9. "The food was cold but tasted excellent." -> POSITIVE (contrastive shift to positive conclusion)
        AiSentimentResponse.SentimentItem s9 = sentimentService.analyzeSentiment("The food was cold but tasted excellent.");
        assertEquals("POSITIVE", s9.getSentiment());

        // 10. "I do not recommend this restaurant." -> NEGATIVE (negated recommend)
        AiSentimentResponse.SentimentItem s10 = sentimentService.analyzeSentiment("I do not recommend this restaurant.");
        assertEquals("NEGATIVE", s10.getSentiment());
    }

    @Test
    public void testTenReviewsClusteringWithMultipleThresholds() {
        List<String> ids = List.of("R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10");
        List<String> texts = List.of(
                "The soup was freezing cold.",
                "The curry was served lukewarm.",
                "The food was too hot to eat.",
                "The delivery arrived 60 minutes late.",
                "My order took an hour to arrive.",
                "The waiter was rude.",
                "The staff treated us disrespectfully.",
                "The bill included an incorrect charge.",
                "I was charged twice for the same order.",
                "The food was excellent."
        );
        List<List<Double>> embeddings = embeddingService.generateBatch(texts);

        // 1. Threshold 0.35 (broad agglomeration)
        AiClusterResponse resp35 = clusteringService.cluster(ids, texts, embeddings, 0.35);
        assertNotNull(resp35);
        assertTrue(resp35.getTotalClusters() >= 1);

        // 2. Threshold 0.55 (balanced semantic separation)
        AiClusterResponse resp55 = clusteringService.cluster(ids, texts, embeddings, 0.55);
        assertNotNull(resp55);
        assertTrue(resp55.getTotalClusters() >= 2);

        // 3. Threshold 0.75 (strict cutoff, separating tight pairs or forming outliers)
        AiClusterResponse resp75 = clusteringService.cluster(ids, texts, embeddings, 0.75);
        assertNotNull(resp75);
        // Verify threshold actually changes the grouping structure
        assertNotEquals(resp35.getTotalClusters(), resp75.getTotalClusters());
    }

    @Test
    public void testEmbeddingDimensionAndNormalization() {
        List<Double> vec = embeddingService.generateEmbedding("Food temperature and quality was subpar.");
        assertEquals(384, vec.size());

        double normSq = 0.0;
        for (Double val : vec) normSq += val * val;
        assertEquals(1.0, Math.sqrt(normSq), 1e-4);
    }

    @Test
    public void testCosineSimilarityMathematicalProperties() {
        List<Double> v1 = List.of(1.0, 0.0, 0.0);
        List<Double> v2 = List.of(1.0, 0.0, 0.0);
        List<Double> vOrthogonal = List.of(0.0, 1.0, 0.0);
        List<Double> vOpposite = List.of(-1.0, 0.0, 0.0);

        // Identical vectors: cosine similarity = 1.0
        assertEquals(1.0, NativeClusteringService.cosineSimilarity(v1, v2), 1e-6);

        // Orthogonal vectors: cosine similarity = 0.0
        assertEquals(0.0, NativeClusteringService.cosineSimilarity(v1, vOrthogonal), 1e-6);

        // Opposite vectors: cosine similarity = -1.0
        assertEquals(-1.0, NativeClusteringService.cosineSimilarity(v1, vOpposite), 1e-6);

        // Null or empty handling
        assertEquals(0.0, NativeClusteringService.cosineSimilarity(null, v1), 1e-6);
        assertEquals(0.0, NativeClusteringService.cosineSimilarity(Collections.emptyList(), v1), 1e-6);
    }

    @Test
    public void testAgglomerativeCentroidCalculationAndNormalization() {
        List<Double> v1 = List.of(1.0, 0.0, 0.0);
        List<Double> v2 = List.of(0.0, 1.0, 0.0);
        List<Double> centroid = NativeClusteringService.calculateCentroid(List.of(v1, v2));

        assertEquals(3, centroid.size());
        // (1, 1, 0) normalized is (1/sqrt(2), 1/sqrt(2), 0) ~= (0.7071, 0.7071, 0)
        double expected = 1.0 / Math.sqrt(2.0);
        assertEquals(expected, centroid.get(0), 1e-4);
        assertEquals(expected, centroid.get(1), 1e-4);
        assertEquals(0.0, centroid.get(2), 1e-4);

        // Centroid norm is 1.0
        double normSq = centroid.stream().mapToDouble(d -> d * d).sum();
        assertEquals(1.0, Math.sqrt(normSq), 1e-4);
    }
}
