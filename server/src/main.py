from fastapi import FastAPI

from src.setup.cors import setup_cors
from src.setup.route import setup_routers

app = FastAPI(
    title="GPT Chat API",
    description="GPTを使ったチャットアプリのバックエンドAPI",
    version="0.1.0",
)

setup_cors(app)
setup_routers(app)
