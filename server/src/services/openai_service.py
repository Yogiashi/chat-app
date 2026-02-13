from collections.abc import AsyncGenerator

from openai import AsyncOpenAI

from src.config import settings


class OpenAIService:
    """OpenAI APIとの通信を担当するサービス

    なぜクラスにするか：
    - クライアントをインスタンス変数として保持できる
    - 将来、リトライ処理やエラーハンドリングなどの共通ロジックをメソッドとして追加しやすい
    - テスト時にこのクラスごとモックに差し替えられる
    """

    def __init__(self, client: AsyncOpenAI) -> None:
        self._client = client

    async def get_response(self, messages: list[dict]) -> str:
        """GPTにメッセージを送って、応答をまるごと返す"""
        response = await self._client.chat.completions.create(
            model=settings.openai_model,
            messages=messages,
        )
        return response.choices[0].message.content

    async def get_response_stream(
        self,
        messages: list[dict],
    ) -> AsyncGenerator[str, None]:
        """GPTにメッセージを送って、応答を1チャンクずつ返す"""
        stream = await self._client.chat.completions.create(
            model=settings.openai_model,
            messages=messages,
            stream=True,
        )
        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content is not None:
                yield content
