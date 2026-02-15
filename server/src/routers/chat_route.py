from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_session
from src.dependencies import get_chat_usecase
from src.schemas.request.chat_request import ChatRequest
from src.schemas.response.chat_response import ChatResponse

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    session: AsyncSession = Depends(get_session),
):
    """通常のチャットエンドポイント"""
    usecase = get_chat_usecase(session)
    content, conversation_id = await usecase.handle(request)
    return ChatResponse(content=content, conversation_id=conversation_id)


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    session: AsyncSession = Depends(get_session),
):
    """ストリーミングチャットエンドポイント"""
    usecase = get_chat_usecase(session)
    stream, conversation_id = await usecase.handle_stream(request)

    # conversation_id をヘッダーで返す（ストリーミング中はJSONを返せないため）
    return StreamingResponse(
        stream,
        media_type="text/event-stream",
        headers={"X-Conversation-Id": str(conversation_id)},
    )
