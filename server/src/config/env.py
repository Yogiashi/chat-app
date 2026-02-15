from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """環境変数設定"""

    app_env: str = "development"
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    allowed_origins: str
    database_url: str

    @property
    def allowed_origins_list(self) -> list[str]:
        """カンマ区切りの文字列をリストに変換する"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }


settings = Settings()  # type: ignore
