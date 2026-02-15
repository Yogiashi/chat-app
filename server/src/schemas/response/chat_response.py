import uuid
from datetime import datetime

from pydantic import BaseModel


class ChatResponse(BaseModel):
    content: str
    conversation_id: uuid.UUID


class MessageResponse(BaseModel):
    id: uuid.UUID
    role: str
    content: str
    created_at: datetime


class ConversationResponse(BaseModel):
    id: uuid.UUID
    title: str
    created_at: datetime
    updated_at: datetime


class ConversationDetailResponse(BaseModel):
    id: uuid.UUID
    title: str
    messages: list[MessageResponse]
    created_at: datetime
    updated_at: datetime
