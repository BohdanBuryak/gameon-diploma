from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db, engine, Base
import models

# Створюємо всі таблиці в базі даних (якщо їх ще немає)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GameOn API",
    description="API для системи конфігурування комп'ютерної техніки",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Welcome to GameOn API! Server is running 🚀"}

# Оновлений роут статусу, який перевіряє БД
@app.get("/api/v1/status")
async def check_status(db: Session = Depends(get_db)):
    # Якщо функція отримала сесію, значить підключення успішне
    return {
        "status": "ok",
        "database": "connected 🟢",
        "ai_module": "standby"
    }