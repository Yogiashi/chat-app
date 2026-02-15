from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings


def setup_cors(app: FastAPI) -> None:
    """
    CORS設定を適用する
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Conversation-Id"],
    )
