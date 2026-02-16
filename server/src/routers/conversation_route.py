import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession


from src.db.database import get_session
from src.dependencies.auth import get_current_user
from src.repositories.conversation_repository import ConversationRepository
from src.schemas.response.chat_response import (
    ConversationDetailResponse,
    ConversationResponse,
    MessageResponse,
)

router = APIRouter(prefix="/api/v1/conversations", tags=["conversations"])


@router.get("", response_model=list[ConversationResponse])
async def get_conversations(
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    repo = ConversationRepository(session)
    conversations = await repo.get_all(current_user["uid"])
    return [
        ConversationResponse(
            id=c.id,
            title=c.title,
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        for c in conversations
    ]


@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    repo = ConversationRepository(session)
    conversation = await repo.get_by_id(conversation_id, current_user["uid"])

    if conversation is None:
        raise HTTPException(status_code=404, detail="会話が見つかりません")

    return ConversationDetailResponse(
        id=conversation.id,
        title=conversation.title,
        messages=[
            MessageResponse(
                id=m.id,
                role=m.role,
                content=m.content,
                created_at=m.created_at,
            )
            for m in conversation.messages
        ],
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
    )


@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    repo = ConversationRepository(session)
    deleted = await repo.delete(conversation_id, current_user["uid"])

    if not deleted:
        raise HTTPException(status_code=404, detail="会話が見つかりません")

    return {"detail": "削除しました"}
