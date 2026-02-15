from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base

if TYPE_CHECKING:
    from src.models.conversation import Conversation


class Message(Base):
    """メッセージテーブル

    1つのメッセージを表す。会話の中のユーザー発言やAI応答。

    ForeignKey：外部キー。別テーブルのレコードを参照する。
    「このメッセージは、どの会話に属するか」を示す。
    """

    __tablename__ = "messages"

    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conversations.id"))
    role: Mapped[str] = mapped_column(String(20))  # "user", "assistant", "system"
    content: Mapped[str] = mapped_column(Text)  # メッセージ本文（長文対応のためText型）

    # リレーション：このメッセージが属する会話
    conversation: Mapped["Conversation"] = relationship(back_populates="messages")
