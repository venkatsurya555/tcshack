import urllib.request
import json
import math

def post(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

texts = [
    "The food is cold.",
    "The meal is not hot.",
    "My biryani was served cold.",
    "The curry contains too much salt.",
    "The dish is excessively salty.",
    "The dining tables are dirty.",
    "The food is not cold."
]

print("=== 1. EMBEDDINGS & SIMILARITY ===")
emb_resp = post('http://localhost:8001/nlp/embeddings', {'texts': texts})
embs = emb_resp['embeddings']
print(f"Returned {len(embs)} vectors of dimension {emb_resp['dimension']}")

def cos_sim(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    n1 = math.sqrt(sum(a * a for a in v1))
    n2 = math.sqrt(sum(b * b for b in v2))
    return dot / (n1 * n2)

sim_cold_not_hot = cos_sim(embs[0], embs[1])
sim_cold_biryani = cos_sim(embs[0], embs[2])
sim_salt_salty = cos_sim(embs[3], embs[4])
sim_cold_dirty = cos_sim(embs[0], embs[5])
sim_salt_dirty = cos_sim(embs[3], embs[5])
sim_cold_not_cold = cos_sim(embs[0], embs[6])

print(f"Cold vs Not hot: {sim_cold_not_hot:.3f}")
print(f"Cold vs Biryani cold: {sim_cold_biryani:.3f}")
print(f"Too much salt vs Excessively salty: {sim_salt_salty:.3f}")
print(f"Cold vs Tables dirty (Unrelated): {sim_cold_dirty:.3f}")
print(f"Salt vs Tables dirty (Unrelated): {sim_salt_dirty:.3f}")
print(f"Cold vs Not cold: {sim_cold_not_cold:.3f}")

print("\n=== 2. SENTIMENT EVALUATION ===")
sent_resp = post('http://localhost:8001/nlp/sentiment', {'texts': texts})
for t, s in zip(texts, sent_resp['results']):
    print(f"'{t}' -> Sentiment: {s['sentiment']} (Confidence: {s['confidence']}, Polarity: {s['polarity']})")

print("\n=== 3. SEMANTIC CLUSTERING (Threshold = 0.65) ===")
cluster_resp = post('http://localhost:8001/nlp/cluster', {
    'reviewIds': [f'rev_{i+1}' for i in range(len(texts))],
    'texts': texts,
    'embeddings': embs,
    'similarityThreshold': 0.65
})
print(f"Total Clusters: {cluster_resp['totalClusters']}, Ungrouped: {cluster_resp['ungroupedCount']}")
for g in cluster_resp['groups']:
    print(f" - [{g['groupId']}] {g['label']} ({g['count']} reviews): {g['representativeExamples']}")
