# --- 起動・停止 ---

# コンテナをビルド
build:
	docker compose build

# コンテナをバックグラウンドで起動
up:
	docker compose up -d

# コンテナを起動
start:
	docker compose start

# コンテナを停止
stop:
	docker compose stop

# コンテナを停止して削除
down:
	docker compose down

# コンテナを再起動
restart:
	docker compose restart

# --- ログ ---

# 全コンテナのログを表示（リアルタイムで追従）
logs:
	docker compose logs -f

# サーバーのログだけ表示
logs-server:
	docker compose logs -f server

# フロントのログだけ表示
logs-front:
	docker compose logs -f front

# --- コンテナ内に入る ---

# サーバーコンテナ内でbashを開く（デバッグ用）
# 「コンテナの中に入って直接コマンドを打ちたい」ときに使う
sh-server:
	docker compose exec server bash

# フロントコンテナ内でbashを開く
sh-front:
	docker compose exec front bash

# --- パッケージ管理 ---

# サーバーにPythonパッケージを追加（例: make add-server p=httpx）
# uv add をコンテナ内で実行し、ローカルにも反映する
add-server:
	docker compose exec server uv add $(p)

# フロントにnpmパッケージを追加（例: make add-front p=axios）
add-front:
	cd front && npm install $(p)
	docker compose up --build front -d

# --- 掃除 ---

# コンテナ・ネットワーク・ボリュームを全部削除（完全リセット）
clean:
	docker compose down -v --rmi local

# Dockerの不要データを掃除（容量が逼迫したとき）
prune:
	docker system prune -f

# --- コード品質 ---

# サーバーのコードをフォーマット（自動整形）
format-server:
	cd server && uv run ruff format .
	cd server && uv run ruff check --fix .

# フロントのコードをフォーマット
format-front:
	cd front && npx prettier --write "src/**/*.{ts,tsx,css}"

# 両方まとめてフォーマット
format:
	@make format-server
	@make format-front

# サーバーのLintチェック（修正はしない、確認だけ）
lint-server:
	cd server && uv run ruff check .
	cd server && uv run ruff format --check .

# フロントのLintチェック
lint-front:
	cd front && npx tsc --noEmit

# 両方まとめてチェック
lint:
	@make lint-server
	@make lint-front

# --- ヘルプ ---

# コマンド一覧を表示
help:
	@echo "up          - コンテナをビルドして起動"
	@echo "upd         - コンテナをバックグラウンドで起動"
	@echo "down        - コンテナを停止"
	@echo "restart     - コンテナを再起動"
	@echo "logs        - 全ログ表示"
	@echo "logs-server - サーバーログ表示"
	@echo "logs-front  - フロントログ表示"
	@echo "sh-server   - サーバーコンテナに入る"
	@echo "sh-front    - フロントコンテナに入る"
	@echo "add-server  - Pythonパッケージ追加 (p=パッケージ名)"
	@echo "add-front   - npmパッケージ追加 (p=パッケージ名)"
	@echo "format         - 全コードをフォーマット"
	@echo "format-server  - サーバーコードをフォーマット"
	@echo "format-front   - フロントコードをフォーマット"
	@echo "lint        - 全コードをチェック"
	@echo "lint-server - サーバーコードをチェック"
	@echo "lint-front  - フロントコードをチェック"
	@echo "clean       - 全コンテナ・ボリューム削除"
	@echo "prune       - Docker不要データ掃除"
