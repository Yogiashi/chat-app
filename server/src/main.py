from fastapi import FastAPI

app = FastAPI()


@app.get("/api/health")
async def health_check():
    """ヘルスチェック用エンドポイント
    サーバーが正常に動いているか確認するためのもの。
    インフラ側から「このサーバー生きてる？」と確認するのに使う。
    """
    return {"status": "ok"}
