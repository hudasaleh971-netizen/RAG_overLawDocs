from fastapi import APIRouter
from pydantic import BaseModel
from src.agent.chat import chat_with_agent

router = APIRouter()

class Query(BaseModel):
    query: str

@router.post("/chat")
async def chat(query: Query):
    response = chat_with_agent(query.query)
    return {"response": response}
