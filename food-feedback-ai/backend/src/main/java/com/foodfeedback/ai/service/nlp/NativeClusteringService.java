package com.foodfeedback.ai.service.nlp;

import com.foodfeedback.ai.dto.AiClusterResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Pure Java Agglomerative Semantic Clustering Engine.
 * 100% Native Java implementation matching and exceeding Python clustering service.
 */
@Service
public class NativeClusteringService {

    private final NativeLabelingService labelingService;

    @Autowired
    public NativeClusteringService(NativeLabelingService labelingService) {
        this.labelingService = labelingService;
    }

    public static double cosineSimilarity(List<Double> v1, List<Double> v2) {
        if (v1 == null || v2 == null || v1.size() != v2.size() || v1.isEmpty()) {
            return 0.0;
        }
        double dot = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;
        for (int i = 0; i < v1.size(); i++) {
            double a = v1.get(i);
            double b = v2.get(i);
            dot += a * b;
            norm1 += a * a;
            norm2 += b * b;
        }
        if (norm1 < 1e-9 || norm2 < 1e-9) {
            return 0.0;
        }
        return Math.max(-1.0, Math.min(1.0, dot / (Math.sqrt(norm1) * Math.sqrt(norm2))));
    }

    public static List<Double> calculateCentroid(List<List<Double>> vectors) {
        if (vectors == null || vectors.isEmpty()) {
            List<Double> c = new ArrayList<>(NativeEmbeddingService.DIMENSION);
            for (int i = 0; i < NativeEmbeddingService.DIMENSION; i++) c.add(0.0);
            return c;
        }
        int dim = vectors.get(0).size();
        double[] centroid = new double[dim];
        for (List<Double> v : vectors) {
            for (int i = 0; i < dim; i++) {
                centroid[i] += v.get(i);
            }
        }
        double n = vectors.size();
        double sumSq = 0.0;
        for (int i = 0; i < dim; i++) {
            centroid[i] /= n;
            sumSq += centroid[i] * centroid[i];
        }
        double norm = Math.sqrt(sumSq);
        List<Double> res = new ArrayList<>(dim);
        if (norm > 1e-9) {
            for (int i = 0; i < dim; i++) {
                res.add(centroid[i] / norm);
            }
        } else {
            for (int i = 0; i < dim; i++) {
                res.add(i == 0 ? 1.0 : 0.0);
            }
        }
        return res;
    }

    public AiClusterResponse cluster(
            List<String> reviewIds,
            List<String> texts,
            List<List<Double>> embeddings,
            double similarityThreshold
    ) {
        int n = texts.size();
        AiClusterResponse response = new AiClusterResponse();

        if (n == 0) {
            response.setGroups(Collections.emptyList());
            response.setAssignments(Collections.emptyList());
            response.setTotalClusters(0);
            response.setUngroupedCount(0);
            return response;
        }

        if (n == 1) {
            NativeLabelingService.LabelResult lr = labelingService.labelCluster(1, List.of(texts.get(0)));
            AiClusterResponse.ClusterGroupItem grp = new AiClusterResponse.ClusterGroupItem();
            grp.setGroupId("grp_1");
            grp.setLabel(lr.getLabel());
            grp.setDescription(lr.getDescription());
            grp.setCount(1);
            grp.setReviewIds(List.of(reviewIds.get(0)));
            grp.setRepresentativeExamples(List.of(texts.get(0)));

            AiClusterResponse.ReviewAssignmentItem assign = new AiClusterResponse.ReviewAssignmentItem();
            assign.setReviewId(reviewIds.get(0));
            assign.setGroupId("grp_1");
            assign.setGroupLabel(lr.getLabel());
            assign.setSimilarityToCentroid(1.0);
            assign.setOutlier(false);

            response.setGroups(List.of(grp));
            response.setAssignments(List.of(assign));
            response.setTotalClusters(1);
            response.setUngroupedCount(0);
            return response;
        }

        // 1. Calculate pairwise cosine similarity matrix
        double[][] simMatrix = new double[n][n];
        for (int i = 0; i < n; i++) {
            simMatrix[i][i] = 1.0;
            for (int j = i + 1; j < n; j++) {
                double sim = cosineSimilarity(embeddings.get(i), embeddings.get(j));
                simMatrix[i][j] = sim;
                simMatrix[j][i] = sim;
            }
        }

        // 2. Agglomerative clustering with maximum similarity link and threshold cutoff
        List<List<Integer>> clusters = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            List<Integer> c = new ArrayList<>();
            c.add(i);
            clusters.add(c);
        }

        while (clusters.size() > 1) {
            double bestSim = -1.0;
            int bestI = -1;
            int bestJ = -1;

            for (int i = 0; i < clusters.size(); i++) {
                for (int j = i + 1; j < clusters.size(); j++) {
                    double simSum = 0.0;
                    for (int idx1 : clusters.get(i)) {
                        for (int idx2 : clusters.get(j)) {
                            simSum += simMatrix[idx1][idx2];
                        }
                    }
                    double avgSim = simSum / (clusters.get(i).size() * clusters.get(j).size());
                    if (avgSim > bestSim) {
                        bestSim = avgSim;
                        bestI = i;
                        bestJ = j;
                    }
                }
            }

            if (bestSim >= similarityThreshold && bestI != -1) {
                List<Integer> merged = new ArrayList<>(clusters.get(bestI));
                merged.addAll(clusters.get(bestJ));
                // Remove in descending order to preserve indexes
                clusters.remove(bestJ);
                clusters.remove(bestI);
                clusters.add(merged);
            } else {
                break;
            }
        }

        // 3. Separate true clusters from isolated outliers
        List<AiClusterResponse.ClusterGroupItem> finalGroups = new ArrayList<>();
        AiClusterResponse.ReviewAssignmentItem[] assignments = new AiClusterResponse.ReviewAssignmentItem[n];
        List<Integer> ungroupedIndices = new ArrayList<>();
        int clusterCounter = 1;

        for (List<Integer> c : clusters) {
            if (c.size() == 1) {
                int itemIdx = c.get(0);
                double maxSimToAny = 0.0;
                for (int other = 0; other < n; other++) {
                    if (other != itemIdx && simMatrix[itemIdx][other] > maxSimToAny) {
                        maxSimToAny = simMatrix[itemIdx][other];
                    }
                }
                if (maxSimToAny < similarityThreshold) {
                    ungroupedIndices.add(itemIdx);
                    continue;
                }
            }

            String grpId = "grp_" + clusterCounter;
            List<String> clusterTexts = c.stream().map(texts::get).collect(Collectors.toList());
            List<String> clusterReviewIds = c.stream().map(reviewIds::get).collect(Collectors.toList());
            List<List<Double>> clusterEmbeddings = c.stream().map(embeddings::get).collect(Collectors.toList());

            List<Double> centroid = calculateCentroid(clusterEmbeddings);
            NativeLabelingService.LabelResult lr = labelingService.labelCluster(clusterCounter, clusterTexts);

            // Compute similarities to centroid
            double[] similarities = new double[c.size()];
            for (int k = 0; k < c.size(); k++) {
                similarities[k] = cosineSimilarity(clusterEmbeddings.get(k), centroid);
            }

            // Sort representative examples by similarity descending
            List<Integer> sortedLocalIndices = new ArrayList<>();
            for (int k = 0; k < c.size(); k++) sortedLocalIndices.add(k);
            sortedLocalIndices.sort((a, b) -> Double.compare(similarities[b], similarities[a]));

            List<String> representativeExamples = sortedLocalIndices.stream()
                    .limit(3)
                    .map(clusterTexts::get)
                    .collect(Collectors.toList());

            AiClusterResponse.ClusterGroupItem groupItem = new AiClusterResponse.ClusterGroupItem();
            groupItem.setGroupId(grpId);
            groupItem.setLabel(lr.getLabel());
            groupItem.setDescription(lr.getDescription());
            groupItem.setCount(c.size());
            groupItem.setReviewIds(clusterReviewIds);
            groupItem.setRepresentativeExamples(representativeExamples);
            finalGroups.add(groupItem);

            for (int localIdx = 0; localIdx < c.size(); localIdx++) {
                int globalIdx = c.get(localIdx);
                AiClusterResponse.ReviewAssignmentItem assign = new AiClusterResponse.ReviewAssignmentItem();
                assign.setReviewId(reviewIds.get(globalIdx));
                assign.setGroupId(grpId);
                assign.setGroupLabel(lr.getLabel());
                assign.setSimilarityToCentroid(Math.round(similarities[localIdx] * 1000.0) / 1000.0);
                assign.setOutlier(false);
                assignments[globalIdx] = assign;
            }
            clusterCounter++;
        }

        // 4. Handle Ungrouped Outliers
        for (int globalIdx : ungroupedIndices) {
            AiClusterResponse.ReviewAssignmentItem assign = new AiClusterResponse.ReviewAssignmentItem();
            assign.setReviewId(reviewIds.get(globalIdx));
            assign.setGroupId("ungrouped");
            assign.setGroupLabel("Ungrouped / Other");
            assign.setSimilarityToCentroid(0.0);
            assign.setOutlier(true);
            assignments[globalIdx] = assign;
        }

        if (!ungroupedIndices.isEmpty()) {
            AiClusterResponse.ClusterGroupItem ungroupedGroup = new AiClusterResponse.ClusterGroupItem();
            ungroupedGroup.setGroupId("ungrouped");
            ungroupedGroup.setLabel("Ungrouped / Other");
            ungroupedGroup.setDescription("Unique or isolated reviews that did not reach the semantic similarity threshold");
            ungroupedGroup.setCount(ungroupedIndices.size());
            ungroupedGroup.setReviewIds(ungroupedIndices.stream().map(reviewIds::get).collect(Collectors.toList()));
            ungroupedGroup.setRepresentativeExamples(
                    ungroupedIndices.stream().limit(3).map(texts::get).collect(Collectors.toList())
            );
            finalGroups.add(ungroupedGroup);
        }

        // Sort groups by review count descending (keeping ungrouped last)
        finalGroups.sort((a, b) -> {
            boolean aUn = "ungrouped".equalsIgnoreCase(a.getGroupId());
            boolean bUn = "ungrouped".equalsIgnoreCase(b.getGroupId());
            if (aUn && !bUn) return 1;
            if (!aUn && bUn) return -1;
            return Integer.compare(b.getCount(), a.getCount());
        });

        List<AiClusterResponse.ReviewAssignmentItem> assignmentList = Arrays.stream(assignments)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        response.setGroups(finalGroups);
        response.setAssignments(assignmentList);
        response.setTotalClusters((int) finalGroups.stream().filter(g -> !"ungrouped".equalsIgnoreCase(g.getGroupId())).count());
        response.setUngroupedCount(ungroupedIndices.size());

        return response;
    }
}
