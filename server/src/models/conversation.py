
from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base

if TYPE_CHECKING:
    from src.models.message import Message


class Conversation(Base):
    """会話テーブル

    1つの「会話」を表す。ChatGPTの左サイドバーに並ぶ会話一覧のイメージ。

    __tablename__：実際にDBに作られるテーブル名。
    Mapped[型]：カラムの型をPythonの型で宣言する（SQLAlchemy 2.0の書き方）。
    mapped_column()：カラムの詳細設定。
    """

    __tablename__ = "conversations"

    title: Mapped[str] = mapped_column(String(255), default="新しい会話")

    # リレーション：この会話に紐づくメッセージ一覧
    # back_populates：Message側からも conversation にアクセスできるようにする
    # cascade="all, delete-orphan"：会話を削除したら、紐づくメッセージも全部削除
    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )
