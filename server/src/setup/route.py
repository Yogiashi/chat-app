from fastapi import FastAPI

from src.routers import chat_route, conversation_route, health_route


def setup_routers(app: FastAPI) -> None:
    """
    ルーターをFastAPIアプリに登録する
    """
    app.include_router(health_route.router)
    app.include_router(chat_route.router)
    app.include_router(conversation_route.router)
