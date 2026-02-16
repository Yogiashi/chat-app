from collections.abc import AsyncGenerator
import uuid

from src.repositories.conversation_repository import (
    ConversationRepository,
    MessageRepository,
)
from src.schemas.request.chat_request import ChatRequest
from src.services.openai_service import OpenAIService


class ChatUsecase:

    def __init__(
        self,
        openai_service: OpenAIService,
        conversation_repo: ConversationRepository,
        message_repo: MessageRepository,
    ) -> None:
        self._openai_service = openai_service
        self._conversation_repo = conversation_repo
        self._message_repo = message_repo

    async def handle(
        self, request: ChatRequest, user_uid: str
    ) -> tuple[str, uuid.UUID]:
        conversation_id = await self._get_or_create_conversation(
            request, user_uid
        )

        last_user_message = request.messages[-1]
        await self._message_repo.create(
            conversation_id=conversation_id,
            role=last_user_message.role,
            content=last_user_message.content,
        )

        messages = [m.model_dump() for m in request.messages]
        content = await self._openai_service.get_response(messages)

        await self._message_repo.create(
            conversation_id=conversation_id,
            role="assistant",
            content=content,
        )

        return content, conversation_id

    async def handle_stream(
        self, request: ChatRequest, user_uid: str
    ) -> tuple[AsyncGenerator[str, None], str]:
        conversation_id = await self._get_or_create_conversation(
            request, user_uid
        )

        last_user_message = request.messages[-1]
        await self._message_repo.create(
            conversation_id=conversation_id,
            role=last_user_message.role,
            content=last_user_message.content,
        )

        messages = [m.model_dump() for m in request.messages]

        async def stream_and_save() -> AsyncGenerator[str, None]:
            full_content = ""
            async for chunk in self._openai_service.get_response_stream(
                messages
            ):
                full_content += chunk
                yield chunk

            await self._message_repo.create(
                conversation_id=conversation_id,
                role="assistant",
                content=full_content,
            )

        return stream_and_save(), str(conversation_id)

    async def _get_or_create_conversation(
        self, request: ChatRequest, user_uid: str
    ) -> uuid.UUID:
        if request.conversation_id is not None:
            conversation = await self._conversation_repo.get_by_id(
                request.conversation_id, user_uid
            )
            if conversation is not None:
                return conversation.id

        title = (
            request.messages[0].content[:30] if request.messages else "新しい会話"
        )
        conversation = await self._conversation_repo.create(
            user_uid=user_uid, title=title
        )
        return conversation.id
