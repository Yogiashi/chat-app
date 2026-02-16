import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Firebase Admin SDK の初期化（アプリ全体で1回だけ）
# _apps が空なら初期化する（二重初期化を防ぐ）
if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

# Authorization ヘッダーから "Bearer xxx" のトークン部分を取り出す
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """リクエストから認証済みユーザーを取得する

    FastAPI の Depends で使う。
    router に Depends(get_current_user) を追加するだけで、
    そのエンドポイントが認証必須になる。

    流れ：
    1. Authorization ヘッダーから Bearer トークンを取得
    2. Firebase Admin SDK でトークンを検証
    3. 検証OK → ユーザー情報を返す
    4. 検証NG → 401 エラー
    """
    token = credentials.credentials

    try:
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email", ""),
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証に失敗しました",
        )
