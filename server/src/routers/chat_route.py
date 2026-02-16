from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession


from src.db.database import get_session
from src.dependencies.auth import get_current_user
from src.dependencies.openai import get_chat_usecase
from src.schemas.request.chat_request import ChatRequest
from src.schemas.response.chat_response import ChatResponse

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    usecase = get_chat_usecase(session)
    content, conversation_id = await usecase.handle(request, current_user["uid"])
    return ChatResponse(content=content, conversation_id=conversation_id)


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    usecase = get_chat_usecase(session)
    stream, conversation_id = await usecase.handle_stream(request, current_user["uid"])
    return StreamingResponse(
        stream,
        media_type="text/event-stream",
        headers={"X-Conversation-Id": str(conversation_id)},
    )
