"""
Category and cluster labeling service.
Uses explainable term scoring, theme matching, and semantic centroid keywords
to generate readable, descriptive complaint group titles and descriptions.
"""
from typing import List, Dict, Any, Tuple
import re
from collections import Counter

# Core canonical categories with associated semantic anchors / lexical themes
CANONICAL_THEMES: Dict[str, Dict[str, Any]] = {
    "Slow Service / Long Waiting Time": {
        "keywords": ["wait", "waited", "waiting", "slow", "delay", "delayed", "minutes", "hour", "hours", "late", "took so long", "forever", "time"],
        "description": "Complaints regarding extended wait times, delayed preparation, or slow order delivery."
    },
    "Food Temperature Issues": {
        "keywords": ["cold", "lukewarm", "not hot", "freezing", "chilly", "warm", "reheated", "temperature", "microwaved", "frozen"],
        "description": "Issues concerning meals served below expected temperature or lukewarm dishes."
    },
    "Food Quality & Taste": {
        "keywords": ["salty", "bland", "overcooked", "burnt", "dry", "undercooked", "raw", "tasteless", "stale", "flavorless", "rubbery", "greasy", "oily", "soggy", "quality", "taste"],
        "description": "Dissatisfaction with flavor, seasoning, freshness, texture, or cooking execution."
    },
    "Hygiene and Cleanliness": {
        "keywords": ["hair", "fly", "insect", "bug", "dirty", "unclean", "smell", "sanitation", "filthy", "stain", "cockroach", "washroom", "cleanliness", "hygiene"],
        "description": "Concerns regarding foreign objects in food, dirty utensils, or facility sanitation."
    },
    "Pricing and Billing": {
        "keywords": ["expensive", "overpriced", "bill", "charged", "overcharge", "rip-off", "hidden", "fee", "receipt", "price", "cost", "money"],
        "description": "Complaints regarding incorrect billing, hidden surcharges, or poor value for price."
    },
    "Staff Behaviour": {
        "keywords": ["rude", "impolite", "attitude", "unfriendly", "ignored", "server", "waiter", "staff", "manager", "disrespectful", "hostile", "unprofessional"],
        "description": "Negative interactions with waitstaff, cashiers, or restaurant management."
    },
    "Delivery & Packaging": {
        "keywords": ["spilled", "leaked", "packaging", "courier", "driver", "crushed", "squashed", "wrong item", "missing item", "seal", "container", "delivery"],
        "description": "Delivery logistics issues, spilled food containers, or damaged order packaging."
    },
    "Portion Size": {
        "keywords": ["small", "tiny", "portion", "size", "little", "scanty", "hardly", "barely", "skimp", "amount"],
        "description": "Feedback regarding underwhelming portions or shrinking serving sizes."
    },
    "Positive Feedback": {
        "keywords": ["delicious", "amazing", "great", "excellent", "loved", "perfect", "fresh", "friendly", "fantastic", "wonderful", "best", "recommend"],
        "description": "Compliments and positive reviews celebrating food taste, ambiance, or service excellence."
    }
}

STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
    "with", "by", "from", "up", "about", "into", "through", "after", "is", "was",
    "are", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "i", "we", "my", "our", "you", "your", "they", "their", "it", "its", "this", "that",
    "food", "restaurant", "order", "ordered", "meal", "very", "really", "so", "just"
}


def extract_keywords(texts: List[str], top_k: int = 5) -> List[str]:
    """Extract top prominent content keywords from a cluster of reviews."""
    all_words = []
    for text in texts:
        tokens = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
        meaningful = [tok for tok in tokens if tok not in STOP_WORDS]
        all_words.extend(meaningful)

    counts = Counter(all_words)
    return [word for word, _ in counts.most_common(top_k)]


class LabelingService:
    def generate_label_for_cluster(self, review_texts: List[str]) -> Tuple[str, str]:
        info = self.label_cluster(1, review_texts)
        return info["label"], info["description"]

    def label_cluster(self, cluster_id: int, review_texts: List[str]) -> Dict[str, Any]:
        """
        Assign an explainable category label and summary description to a cluster.
        If cluster_id == -1, it represents ungrouped / outlier reviews.
        """
        if cluster_id == -1 or not review_texts:
            return {
                "label": "Ungrouped / Other",
                "description": "Distinct reviews that do not fit standard semantic complaint patterns or share high similarity with other clusters.",
                "top_keywords": extract_keywords(review_texts, 5) if review_texts else []
            }

        combined_text = " ".join(review_texts).lower()

        best_category = None
        best_score = -1

        for category, meta in CANONICAL_THEMES.items():
            score = 0
            for kw in meta["keywords"]:
                if " " in kw:
                    if kw in combined_text:
                        score += 3
                else:
                    count = len(re.findall(rf"\b{re.escape(kw)}\b", combined_text))
                    score += count * 2

            if score > best_score:
                best_score = score
                best_category = category

        top_kw = extract_keywords(review_texts, 5)

        if best_score > 0 and best_category:
            label = best_category
            description = CANONICAL_THEMES[best_category]["description"]
        else:
            if top_kw:
                label = f"Issue with {', '.join([k.capitalize() for k in top_kw[:2]])}"
                description = f"Complaints frequently mentioning: {', '.join(top_kw)}."
            else:
                label = f"Complaint Cluster #{cluster_id}"
                description = "Group of semantically similar customer complaints."

        return {
            "label": label,
            "description": description,
            "top_keywords": top_kw
        }

labeling_service = LabelingService()

def label_cluster(cluster_id: int, review_texts: List[str]) -> Dict[str, Any]:
    return labeling_service.label_cluster(cluster_id, review_texts)
