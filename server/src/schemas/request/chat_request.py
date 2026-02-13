from pydantic import BaseModel


class Message(BaseModel):
    """1つのメッセージを表すモデル"""

    role: str
    content: str


class ChatRequest(BaseModel):
    """チャットAPIへのリクエスト"""

    messages: list[Message]
