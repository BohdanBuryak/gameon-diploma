import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# 1. Знаходимо точний шлях до папки backend та файлу .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")

# 2. Завантажуємо файл
load_dotenv(ENV_PATH)

# 3. Читаємо змінну
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# 4. ЖОРСТКА ПЕРЕВІРКА (якщо щось не так, ми одразу побачимо це в терміналі)
if not SQLALCHEMY_DATABASE_URL:
    print(f"\n[DEBUG] Я шукав файл .env ось тут: {ENV_PATH}")
    raise ValueError("КРИТИЧНА ПОМИЛКА: Не вдалося знайти DATABASE_URL. Перевір файл .env!")

# 5. Виправляємо префікс для SQLAlchemy (якщо потрібно)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 6. Створюємо підключення
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()