import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.conversation import Conversation
from src.models.message import Message


class ConversationRepository:

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, user_uid: str, title: str = "新しい会話") -> Conversation:
        conversation = Conversation(title=title, user_uid=user_uid)
        self._session.add(conversation)
        await self._session.flush()
        return conversation

    async def get_by_id(
        self, conversation_id: uuid.UUID, user_uid: str
    ) -> Conversation | None:
        """IDで会話を取得する（ユーザーの所有チェック付き）

        user_uid でもフィルタすることで、
        他人の会話IDを指定してもアクセスできないようにする。
        """
        result = await self._session.execute(
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .where(Conversation.user_uid == user_uid)
            .options(selectinload(Conversation.messages))
        )
        return result.scalar_one_or_none()

    async def get_all(self, user_uid: str) -> list[Conversation]:
        """そのユーザーの会話一覧を取得する"""
        result = await self._session.execute(
            select(Conversation)
            .where(Conversation.user_uid == user_uid)
            .order_by(Conversation.updated_at.desc())
        )
        return list(result.scalars().all())

    async def delete(self, conversation_id: uuid.UUID, user_uid: str) -> bool:
        conversation = await self.get_by_id(conversation_id, user_uid)
        if conversation is None:
            return False
        await self._session.delete(conversation)
        return True


class MessageRepository:

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(
        self,
        conversation_id: uuid.UUID,
        role: str,
        content: str,
    ) -> Message:
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
        )
        self._session.add(message)
        await self._session.flush()
        return message
