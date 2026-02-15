#!/bin/bash
set -e

# マイグレーションを実行（テーブルがなければ作成される）
echo "Running database migrations..."
uv run alembic upgrade head

# サーバーを起動
echo "Starting server..."
exec uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 2
