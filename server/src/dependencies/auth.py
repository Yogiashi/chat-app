import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Firebase Admin SDK の初期化（アプリ全体で1回だけ）
# _apps が空なら初期化する（二重初期化を防ぐ）
if not firebase_admin._apps:
    # 本番：環境変数に JSON の中身が入っている
    # ローカル：ファイルパスが GOOGLE_APPLICATION_CREDENTIALS に入っている
    firebase_credentials_json = os.environ.get("FIREBASE_CREDENTIALS_JSON")

    if firebase_credentials_json:
        # 本番：JSON 文字列からクレデンシャルを作成
        cred_dict = json.loads(firebase_credentials_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # ローカル：GOOGLE_APPLICATION_CREDENTIALS のファイルパスを使う
        cred = credentials.ApplicationDefault()

    firebase_admin.initialize_app(cred)

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
