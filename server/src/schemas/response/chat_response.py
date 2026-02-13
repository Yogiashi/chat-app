from pydantic import BaseModel


class ChatResponse(BaseModel):
    """チャットAPIからのレスポンス"""

    content: str
