from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import settings
from src.repositories.conversation_repository import (
    ConversationRepository,
    MessageRepository,
)
from src.services.openai_service import OpenAIService
from src.usecases.chat_usecase import ChatUsecase

_client: AsyncOpenAI | None = None
_openai_service: OpenAIService | None = None


def get_openai_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def get_openai_service() -> OpenAIService:
    global _openai_service
    if _openai_service is None:
        _openai_service = OpenAIService(client=get_openai_client())
    return _openai_service


def get_chat_usecase(session: AsyncSession) -> ChatUsecase:
    return ChatUsecase(
        openai_service=get_openai_service(),
        conversation_repo=ConversationRepository(session),
        message_repo=MessageRepository(session),
    )
