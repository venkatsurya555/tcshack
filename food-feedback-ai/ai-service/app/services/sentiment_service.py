"""
Sentiment analysis pipeline service.
Classifies reviews into POSITIVE, NEGATIVE, or NEUTRAL with a confidence score.
Provides clear distinction between semantic topic clustering and sentiment polarity.
"""
from typing import Dict, Any, List
import re

# Domain sentiment lexicon tailored to restaurant and food service feedback
NEGATIVE_WORDS = {
    "horrible", "terrible", "awful", "bad", "disgusting", "poor", "rude", "cold",
    "stale", "slow", "dirty", "unclean", "raw", "undercooked", "overcooked", "burnt",
    "bland", "salty", "worst", "unacceptable", "delay", "delayed", "late", "refused",
    "spilled", "ruined", "sick", "hair", "insect", "bug", "roach", "expensive",
    "overpriced", "disappointed", "disappointing", "waste", "never", "hate", "unfriendly",
    "hostile", "ignored", "freezing", "lukewarm", "rip-off", "complaint", "dry", "tasteless",
    "spoiled", "spoil", "inedible", "oversalted", "scanty", "small", "tiny", "greasy",
    "oily", "soggy", "excessive", "unpleasant", "contamination", "contaminated"
}

POSITIVE_WORDS = {
    "great", "excellent", "amazing", "wonderful", "fantastic", "delicious", "tasty",
    "fresh", "loved", "friendly", "helpful", "polite", "quick", "fast", "hot", "warm",
    "perfect", "best", "clean", "spotless", "crispy", "flavorful", "satisfying",
    "generous", "reasonable", "recommend", "recommended", "pleased", "enjoyed", "courteous",
    "yum", "yummy", "divine", "heavenly", "superb"
}

NEGATIVE_PHRASES = [
    "too much salt", "too salty", "too spicy", "too sweet", "too cold", "too slow",
    "too small", "not fresh", "not hot", "not clean", "not good", "tastes bad",
    "bad taste", "served cold", "cold food", "long wait", "took too long", "freezing cold",
    "ice cold", "not enough", "poor service", "small quantity", "small portion"
]

INTENSIFIERS = {
    "very": 1.4,
    "extremely": 1.8,
    "incredibly": 1.8,
    "really": 1.3,
    "super": 1.4,
    "totally": 1.4,
    "absolutely": 1.6,
    "completely": 1.5,
    "excessively": 1.7
}

CONTRASTIVE_CONJUNCTIONS = {"but", "however", "although", "yet", "though", "except"}

NEGATIONS = {"not", "never", "no", "n't", "hardly", "barely", "scarcely", "without"}


def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    Analyze sentiment of a single review text.
    Returns:
        sentiment: "POSITIVE", "NEGATIVE", or "NEUTRAL"
        confidence: float between 0.50 and 0.99
        polarity: float score between -1.0 and 1.0
    """
    if not text or not text.strip():
        return {
            "sentiment": "NEUTRAL",
            "confidence": 0.50,
            "polarity": 0.0
        }

    clean_text = text.lower().strip()
    words = re.findall(r"\b[a-zA-Z']+\b", clean_text)

    pos_score = 0.0
    neg_score = 0.0
    negated = False
    clause_weight = 1.0

    # 1. Check multi-word negative phrases
    for phrase in NEGATIVE_PHRASES:
        if phrase in clean_text:
            neg_score += 1.8

    for i, word in enumerate(words):
        # Check contrastive transition
        if word in CONTRASTIVE_CONJUNCTIONS:
            clause_weight = 1.6  # Shift focal emphasis to the post-contrast clause
            negated = False
            continue

        if word in NEGATIONS or word.endswith("n't"):
            negated = True
            continue

        weight = clause_weight
        if i > 0 and words[i - 1] in INTENSIFIERS:
            weight *= INTENSIFIERS[words[i - 1]]

        is_pos = word in POSITIVE_WORDS
        is_neg = word in NEGATIVE_WORDS

        if is_pos:
            if negated:
                neg_score += 1.3 * weight
            else:
                pos_score += 1.0 * weight
            negated = False
        elif is_neg:
            if negated:
                pos_score += 0.8 * weight
            else:
                neg_score += 1.3 * weight
            negated = False
        else:
            if negated and i > 2:
                negated = False

    net_score = pos_score - neg_score
    total_magnitude = pos_score + neg_score

    if total_magnitude == 0:
        return {
            "sentiment": "NEUTRAL",
            "confidence": 0.65,
            "polarity": 0.0
        }

    normalized_polarity = max(-1.0, min(1.0, net_score / max(1.0, total_magnitude)))

    if normalized_polarity <= -0.10:
        sentiment = "NEGATIVE"
        confidence = min(0.99, max(0.60, 0.55 + abs(normalized_polarity) * 0.40))
    elif normalized_polarity >= 0.10:
        sentiment = "POSITIVE"
        confidence = min(0.99, max(0.60, 0.55 + normalized_polarity * 0.40))
    else:
        sentiment = "NEUTRAL"
        confidence = min(0.90, max(0.55, 0.75 - abs(normalized_polarity)))

    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 3),
        "polarity": round(normalized_polarity, 3)
    }


def analyze_batch(texts: List[str]) -> List[Dict[str, Any]]:
    """Analyze sentiment for a list of review texts."""
    return [analyze_sentiment(text) for text in texts]

