from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Citizen Assistant API")

# Configure CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the embedding model (Free, Local HuggingFace model)
logger.info("Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

# Mock Knowledge Base for Ludhiana Civic Services
KNOWLEDGE_BASE = [
    "To apply for a Caste Certificate at a Sewa Kendra, you need: 1) Aadhaar Card, 2) Proof of Residence, 3) Patwari report, and 4) Self-declaration form.",
    "Sewa Kendras in Ludhiana are open from 9:00 AM to 5:00 PM, Monday through Saturday. They are closed on Sundays and public holidays.",
    "For a Residence (Domicile) Certificate, you must provide: 1) Aadhaar Card, 2) Ration Card or Voter ID, 3) School leaving certificate, and 4) Passport size photographs.",
    "An Income Certificate requires: 1) Salary slip or ITR, 2) Aadhaar Card, 3) Self-declaration. It is typically processed within 7 working days.",
    "To register a birth or death, visit the nearest Sewa Kendra or Municipal Corporation office within 21 days of the event. Required documents include hospital discharge summary and ID of the applicant.",
    "For property registration, you must book an appointment with the Sub-Registrar Office. You will need the original deed, stamp duty receipt, and ID proofs of buyers, sellers, and witnesses.",
    "Anganwadi Centers provide supplementary nutrition, non-formal pre-school education, and immunization for children under 6 years, as well as pregnant and lactating mothers.",
    "Patwaris are responsible for maintaining village land records (Fard) and issuing reports required for various certificates like caste and income.",
    "A Booth Level Officer (BLO) is a local election commission representative responsible for maintaining the electoral roll (voter list) for a specific polling booth or part number.",
    "You can find your BLO using your EPIC number (Voter ID) or your Part Number directly in the BLO Directory section of this portal.",
    "If you need to apply for a new Voter ID card, correct existing details, or link your Aadhaar card with your Voter ID, you should contact your assigned Booth Level Officer (BLO) for assistance."
]

# Initialize FAISS index
logger.info("Building FAISS index...")
dimension = model.get_sentence_embedding_dimension()
index = faiss.IndexFlatL2(dimension)

# Embed the knowledge base and add to FAISS
corpus_embeddings = model.encode(KNOWLEDGE_BASE)
index.add(np.array(corpus_embeddings).astype('float32'))
logger.info("FAISS index built successfully.")

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str
    retrieved_context: list[str]

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        # 1. Embed the user query
        query_embedding = model.encode([request.query])
        
        # 2. Search FAISS index for top 2 most relevant contexts
        k = 2
        distances, indices = index.search(np.array(query_embedding).astype('float32'), k)
        
        # 3. Retrieve the matching text
        matched_contexts = []
        for idx in indices[0]:
            if idx < len(KNOWLEDGE_BASE):
                matched_contexts.append(KNOWLEDGE_BASE[idx])
                
        # 4. Format a deterministic conversational response based on context
        if not matched_contexts or distances[0][0] > 1.5: 
            # If distance is too high, it means no good match was found
            response_text = "I'm sorry, I couldn't find specific information about that in my current knowledge base. Please contact the district administration helpdesk for further assistance."
        else:
            context_str = " ".join(matched_contexts)
            response_text = f"Based on the official guidelines: {context_str}\n\nIs there anything else I can help you with?"

        return ChatResponse(
            response=response_text,
            retrieved_context=matched_contexts
        )
        
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while processing your request.")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

from typing import Optional

# In-memory store for rush status (keyed by epicNumber)
rush_status_db = {}

class RushUpdateRequest(BaseModel):
    epicNumber: str
    rushLevel: str
    queueCount: Optional[int] = None

@app.post("/api/rush")
async def update_rush_status(request: RushUpdateRequest):
    if not request.epicNumber:
        raise HTTPException(status_code=400, detail="epicNumber is required")
    if request.rushLevel not in ["Low", "Moderate", "High"]:
        raise HTTPException(status_code=400, detail="Invalid rushLevel. Must be Low, Moderate, or High.")
    
    rush_status_db[request.epicNumber] = {
        "level": request.rushLevel,
        "count": request.queueCount
    }
    return {"status": "success", "epicNumber": request.epicNumber, "data": rush_status_db[request.epicNumber]}

@app.get("/api/rush")
async def get_rush_status():
    return rush_status_db
