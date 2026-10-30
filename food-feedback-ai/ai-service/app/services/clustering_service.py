import math
from typing import List, Dict, Any, Tuple
from .labeling_service import labeling_service

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 < 1e-9 or norm2 < 1e-9:
        return 0.0
    return max(-1.0, min(1.0, dot / (norm1 * norm2)))

def calculate_centroid(vectors: List[List[float]]) -> List[float]:
    if not vectors:
        return [0.0] * 384
    dim = len(vectors[0])
    centroid = [0.0] * dim
    for v in vectors:
        for i in range(dim):
            centroid[i] += v[i]
    n = float(len(vectors))
    centroid = [x / n for x in centroid]
    # Normalize centroid
    norm = math.sqrt(sum(x * x for x in centroid))
    if norm > 1e-9:
        centroid = [x / norm for x in centroid]
    return centroid

class SemanticClusteringService:
    def cluster(
        self,
        review_ids: List[str],
        texts: List[str],
        embeddings: List[List[float]],
        similarity_threshold: float = 0.65,
        algorithm: str = "agglomerative"
    ) -> Dict[str, Any]:
        n = len(texts)
        if n == 0:
            return {"groups": [], "assignments": [], "totalClusters": 0, "ungroupedCount": 0}

        if n == 1:
            lbl, desc = labeling_service.generate_label_for_cluster([texts[0]])
            return {
                "groups": [{
                    "groupId": "grp_1",
                    "label": lbl,
                    "description": desc,
                    "count": 1,
                    "reviewIds": [review_ids[0]],
                    "representativeExamples": [texts[0]]
                }],
                "assignments": [{
                    "reviewId": review_ids[0],
                    "groupId": "grp_1",
                    "groupLabel": lbl,
                    "similarityToCentroid": 1.0,
                    "isOutlier": False
                }],
                "totalClusters": 1,
                "ungroupedCount": 0
            }

        # Calculate pairwise cosine similarity matrix
        sim_matrix = [[0.0] * n for _ in range(n)]
        for i in range(n):
            sim_matrix[i][i] = 1.0
            for j in range(i + 1, n):
                sim = cosine_similarity(embeddings[i], embeddings[j])
                sim_matrix[i][j] = sim
                sim_matrix[j][i] = sim

        # Agglomerative clustering with maximum similarity link and threshold cutoff
        clusters: List[List[int]] = [[i] for i in range(n)]

        while len(clusters) > 1:
            best_sim = -1.0
            best_pair = (-1, -1)

            for i in range(len(clusters)):
                for j in range(i + 1, len(clusters)):
                    # Average linkage similarity between cluster i and cluster j
                    sim_sum = sum(sim_matrix[idx1][idx2] for idx1 in clusters[i] for idx2 in clusters[j])
                    avg_sim = sim_sum / (len(clusters[i]) * len(clusters[j]))
                    if avg_sim > best_sim:
                        best_sim = avg_sim
                        best_pair = (i, j)

            # Check if best similarity satisfies threshold
            if best_sim >= similarity_threshold and best_pair[0] != -1:
                c1_idx, c2_idx = best_pair
                merged = clusters[c1_idx] + clusters[c2_idx]
                clusters.pop(c2_idx)
                clusters.pop(c1_idx)
                clusters.append(merged)
            else:
                break

        # Separate true clusters from isolated outliers
        final_groups = []
        assignments = [None] * n
        ungrouped_indices = []
        cluster_counter = 1

        for c in clusters:
            if len(c) == 1:
                # Single review that didn't merge
                # Check if it has any neighbour >= threshold * 0.9
                max_sim_to_any = max([sim_matrix[c[0]][other] for other in range(n) if other != c[0]] or [0.0])
                if max_sim_to_any < similarity_threshold:
                    ungrouped_indices.append(c[0])
                    continue

            # Form a meaningful complaint group
            grp_id = f"grp_{cluster_counter}"
            cluster_texts = [texts[idx] for idx in c]
            cluster_review_ids = [review_ids[idx] for idx in c]
            cluster_embeddings = [embeddings[idx] for idx in c]

            centroid = calculate_centroid(cluster_embeddings)
            label, description = labeling_service.generate_label_for_cluster(cluster_texts)

            # Compute similarities to centroid
            similarities = [cosine_similarity(embeddings[idx], centroid) for idx in c]
            
            # Sort representative examples
            sorted_indices_by_sim = sorted(range(len(c)), key=lambda k: similarities[k], reverse=True)
            representative_examples = [cluster_texts[k] for k in sorted_indices_by_sim[:3]]

            final_groups.append({
                "groupId": grp_id,
                "label": label,
                "description": description,
                "count": len(c),
                "reviewIds": cluster_review_ids,
                "representativeExamples": representative_examples
            })

            for local_idx, global_idx in enumerate(c):
                assignments[global_idx] = {
                    "reviewId": review_ids[global_idx],
                    "groupId": grp_id,
                    "groupLabel": label,
                    "similarityToCentroid": round(similarities[local_idx], 3),
                    "isOutlier": False
                }
            cluster_counter += 1

        # Handle Ungrouped Outliers
        for global_idx in ungrouped_indices:
            assignments[global_idx] = {
                "reviewId": review_ids[global_idx],
                "groupId": "ungrouped",
                "groupLabel": "Ungrouped / Other",
                "similarityToCentroid": 0.0,
                "isOutlier": True
            }

        if ungrouped_indices:
            final_groups.append({
                "groupId": "ungrouped",
                "label": "Ungrouped / Other",
                "description": "Unique or isolated reviews that did not reach the semantic similarity threshold",
                "count": len(ungrouped_indices),
                "reviewIds": [review_ids[idx] for idx in ungrouped_indices],
                "representativeExamples": [texts[idx] for idx in ungrouped_indices[:3]]
            })

        # Sort groups by review count descending (keeping ungrouped last)
        final_groups.sort(key=lambda g: (-1 if g["groupId"] == "ungrouped" else g["count"]), reverse=True)

        return {
            "groups": final_groups,
            "assignments": [a for a in assignments if a is not None],
            "totalClusters": len([g for g in final_groups if g["groupId"] != "ungrouped"]),
            "ungroupedCount": len(ungrouped_indices)
        }

clustering_service = SemanticClusteringService()

def cluster_reviews(reviews: List[Dict[str, str]], similarity_threshold: float = 0.65) -> Dict[str, Any]:
    from .embedding_service import generate_embeddings
    review_ids = [r["id"] for r in reviews]
    texts = [r["text"] for r in reviews]
    embeddings = generate_embeddings(texts)
    res = clustering_service.cluster(review_ids, texts, embeddings, similarity_threshold=similarity_threshold)

    groups_adapted = []
    unassigned = []
    for g in res["groups"]:
        is_ungrouped = g["groupId"] == "ungrouped"
        cid = -1 if is_ungrouped else int(g["groupId"].replace("grp_", ""))
        if is_ungrouped:
            unassigned = g["reviewIds"]
        
        # map representative texts back to ids
        rep_ids = []
        for rep_text in g["representativeExamples"]:
            for r in reviews:
                if r["text"] == rep_text and r["id"] not in rep_ids:
                    rep_ids.append(r["id"])
                    break
        if not rep_ids:
            rep_ids = g["reviewIds"][:3]

        groups_adapted.append({
            "cluster_id": cid,
            "review_ids": g["reviewIds"],
            "representative_review_ids": rep_ids,
            "is_ungrouped": is_ungrouped
        })

    return {
        "groups": groups_adapted,
        "unassigned_review_ids": unassigned,
        "total_clusters": res["totalClusters"]
    }
