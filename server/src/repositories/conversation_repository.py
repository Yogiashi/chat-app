import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.conversation import Conversation
from src.models.message import Message


class ConversationRepository:
    """会話データの永続化を担当するリポジトリ

    repository層の責任：
    - DBへの読み書きだけを行う
    - ビジネスロジックは含まない
    - SQLAlchemyのセッションを受け取って操作する

    なぜusecaseに直接DB操作を書かないか：
    - DBの種類を変えたくなったとき（PostgreSQL→MongoDBなど）、
      repository だけ差し替えればいい
    - テスト時にDBなしでテストできる（モックに差し替え）
    """

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, title: str = "新しい会話") -> Conversation:
        """新しい会話を作成する"""
        conversation = Conversation(title=title)
        self._session.add(conversation)
        await self._session.flush()  # DBにINSERTを送信（IDが確定する）
        return conversation

    async def get_by_id(self, conversation_id: uuid.UUID) -> Conversation | None:
        """IDで会話を取得する（メッセージも一緒に取得）

        selectinload(Conversation.messages)：
          N+1問題を防ぐための読み込み戦略。
          会話を取得するときに、メッセージも1回のクエリで取得する。

          これがないと：
          1回目: SELECT * FROM conversations WHERE id = 1
          2回目: SELECT * FROM messages WHERE conversation_id = 1
          → メッセージにアクセスするたびに追加クエリが走る

          selectinload があると：
          1回目: SELECT * FROM conversations WHERE id = 1
          2回目: SELECT * FROM messages WHERE conversation_id IN (1)
          → 最初から2回のクエリで済む
        """
        result = await self._session.execute(
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .options(selectinload(Conversation.messages))
        )
        return result.scalar_one_or_none()

    async def get_all(self) -> list[Conversation]:
        """すべての会話を取得する（新しい順）"""
        result = await self._session.execute(
            select(Conversation).order_by(Conversation.updated_at.desc())
        )
        return list(result.scalars().all())

    async def delete(self, conversation_id: uuid.UUID) -> bool:
        """会話を削除する"""
        conversation = await self.get_by_id(conversation_id)
        if conversation is None:
            return False
        await self._session.delete(conversation)
        return True


class MessageRepository:
    """メッセージデータの永続化を担当するリポジトリ"""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(
        self, conversation_id: uuid.UUID, role: str, content: str
    ) -> Message:
        """新しいメッセージを作成する"""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
        )
        self._session.add(message)
        await self._session.flush()
        return message

    async def get_by_conversation_id(self, conversation_id: int) -> list[Message]:
        """指定した会話のメッセージをすべて取得する（古い順）"""
        result = await self._session.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        )
        return list(result.scalars().all())
