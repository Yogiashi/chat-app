import subprocess
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.setup.cors import setup_cors
from src.setup.route import setup_routers


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリのライフサイクル管理

    yield の前 → 起動時に実行される処理
    yield の後 → 終了時に実行される処理

    on_event("startup") / on_event("shutdown") の後継。
    """
    # --- 起動時 ---
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            print("Migrations completed successfully")
            print(result.stdout)
        else:
            print("Migration failed:")
            print(result.stderr)
    except Exception as e:
        print(f"Migration error: {e}")

    yield

    # --- 終了時 ---
    # 必要に応じてDB接続のクリーンアップなどを書く


app = FastAPI(title="GPT Chat API", version="0.1.0", lifespan=lifespan)

setup_cors(app)
setup_routers(app)
