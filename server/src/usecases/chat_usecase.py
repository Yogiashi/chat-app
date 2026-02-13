from collections.abc import AsyncGenerator

from src.schemas.request.chat_request import ChatRequest
from src.services.openai_service import OpenAIService


class ChatUsecase:
    """チャット機能のビジネスロジック

    今後ここに追加されるもの：
    - 会話履歴のDB保存（repository を __init__ で受け取る）
    - 入力のフィルタリング・バリデーション
    - トークン数の計算と制限
    - システムプロンプトの付与
    """

    def __init__(self, openai_service: OpenAIService) -> None:
        self._openai_service = openai_service

    async def handle(self, request: ChatRequest) -> str:
        """通常のチャット処理"""
        messages = [m.model_dump() for m in request.messages]
        return await self._openai_service.get_response(messages)

    async def handle_stream(
        self,
        request: ChatRequest,
    ) -> AsyncGenerator[str, None]:
        """ストリーミングチャット処理"""
        messages = [m.model_dump() for m in request.messages]
        async for chunk in self._openai_service.get_response_stream(messages):
            yield chunk
