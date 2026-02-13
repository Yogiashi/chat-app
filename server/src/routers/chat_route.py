from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from src.dependencies import get_chat_usecase
from src.schemas.request.chat_request import ChatRequest
from src.schemas.response.chat_response import ChatResponse
from src.usecases.chat_usecase import ChatUsecase

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    usecase: ChatUsecase = Depends(get_chat_usecase),
):
    """通常のチャットエンドポイント

    routerはusecaseだけに依存する。
    serviceやclientの存在を知らない。
    これにより、routerの責任が明確になる：
    「リクエストを受け取って、usecaseに渡して、結果を返す」
    """
    content = await usecase.handle(request)
    return ChatResponse(content=content)


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    usecase: ChatUsecase = Depends(get_chat_usecase),
):
    """ストリーミングチャットエンドポイント"""
    return StreamingResponse(
        usecase.handle_stream(request),
        media_type="text/event-stream",
    )
