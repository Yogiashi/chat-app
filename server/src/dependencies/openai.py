from openai import AsyncOpenAI

from src.config import settings
from src.services.openai_service import OpenAIService
from src.usecases.chat_usecase import ChatUsecase

# アプリ全体で使い回すインスタンス
_client: AsyncOpenAI | None = None
_openai_service: OpenAIService | None = None
_chat_usecase: ChatUsecase | None = None


def get_openai_client() -> AsyncOpenAI:
    """OpenAIクライアントを取得する"""
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def get_openai_service() -> OpenAIService:
    """OpenAIServiceのインスタンスを取得する"""
    global _openai_service
    if _openai_service is None:
        _openai_service = OpenAIService(client=get_openai_client())
    return _openai_service


def get_chat_usecase() -> ChatUsecase:
    """ChatUsecaseのインスタンスを取得する

    依存の組み立て順序：
    OpenAIクライアント → OpenAIService → ChatUsecase

    この「組み立て」をrouterではなくここに集約することで：
    - routerは「何に依存するか」だけ知っていればいい
    - 組み立て方が変わってもrouterは影響を受けない
    """
    global _chat_usecase
    if _chat_usecase is None:
        _chat_usecase = ChatUsecase(openai_service=get_openai_service())
    return _chat_usecase
