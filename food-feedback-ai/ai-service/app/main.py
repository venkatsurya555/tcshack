"""
FastAPI NLP AI Service for Semantic Complaint Grouping & Sentiment Analysis.
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from app.services.embedding_service import generate_embeddings, EMBEDDING_DIMENSION
from app.services.clustering_service import clustering_service
from app.services.sentiment_service import analyze_batch, analyze_sentiment
from app.services.labeling_service import label_cluster

app = FastAPI(
    title="Food Feedback AI - NLP Microservice",
    description="Semantic embedding generation, clustering, and sentiment analysis for food complaint grouping.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmbeddingRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, description="List of review texts to embed")


class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    dimension: int
    normalized: bool


class ReviewItem(BaseModel):
    id: str
    text: str


class ClusterRequest(BaseModel):
    reviews: Optional[List[ReviewItem]] = None
    reviewIds: Optional[List[str]] = None
    texts: Optional[List[str]] = None
    embeddings: Optional[List[List[float]]] = None
    similarityThreshold: Optional[float] = Field(0.65, ge=0.1, le=0.99)
    algorithm: Optional[str] = "agglomerative"


class ClusterGroupItem(BaseModel):
    groupId: str
    label: str
    description: str
    count: int
    reviewIds: List[str]
    representativeExamples: List[str]


class ReviewAssignmentItem(BaseModel):
    reviewId: str
    groupId: str
    groupLabel: str
    similarityToCentroid: float
    isOutlier: bool


class ClusterResponse(BaseModel):
    groups: List[ClusterGroupItem]
    assignments: List[ReviewAssignmentItem]
    totalClusters: int
    ungroupedCount: int


class SentimentRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1)


class SentimentResult(BaseModel):
    sentiment: str
    confidence: float
    polarity: float


class SentimentResponse(BaseModel):
    results: List[SentimentResult]


@app.get("/health", tags=["System"])
def health():
    return {
        "status": "UP",
        "service": "ai-service",
        "model": "sentence-transformers/all-MiniLM-L6-v2",
        "dimension": EMBEDDING_DIMENSION,
        "supported_languages": ["en"]
    }


@app.post("/nlp/embeddings", response_model=EmbeddingResponse, tags=["NLP"])
def get_embeddings(request: EmbeddingRequest):
    if not request.texts:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Text list cannot be empty.")
    embeddings = generate_embeddings(request.texts)
    return EmbeddingResponse(
        embeddings=embeddings,
        dimension=EMBEDDING_DIMENSION,
        normalized=True
    )


@app.post("/nlp/sentiment", response_model=SentimentResponse, tags=["NLP"])
def get_sentiment(request: SentimentRequest):
    if not request.texts:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Text list cannot be empty.")
    results = analyze_batch(request.texts)
    return SentimentResponse(
        results=[SentimentResult(**r) for r in results]
    )


@app.post("/nlp/cluster", response_model=ClusterResponse, tags=["NLP"])
def perform_clustering(request: ClusterRequest):
    review_ids = []
    texts = []

    if request.reviews:
        review_ids = [r.id for r in request.reviews]
        texts = [r.text for r in request.reviews]
    elif request.reviewIds and request.texts:
        review_ids = list(request.reviewIds)
        texts = list(request.texts)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No reviews provided for clustering.")

    threshold = request.similarityThreshold or 0.65
    embeddings = request.embeddings
    if not embeddings or len(embeddings) != len(texts):
        embeddings = generate_embeddings(texts)

    # Run agglomerative clustering
    cluster_res = clustering_service.cluster(
        review_ids=review_ids,
        texts=texts,
        embeddings=embeddings,
        similarity_threshold=threshold,
        algorithm=request.algorithm or "agglomerative"
    )

    return ClusterResponse(
        groups=[ClusterGroupItem(**g) for g in cluster_res["groups"]],
        assignments=[ReviewAssignmentItem(**a) for a in cluster_res["assignments"]],
        totalClusters=cluster_res["totalClusters"],
        ungroupedCount=cluster_res["ungroupedCount"]
    )
