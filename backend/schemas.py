from pydantic import BaseModel, Field
from typing import Optional, List

# --- СХЕМИ ДЛЯ КАТЕГОРІЙ ---

# 1. Схема для створення категорії (те, що ми очікуємо від користувача)
class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, example="Процесори")

# 2. Схема для відповіді (те, що ми повертаємо користувачу, вже з ID з бази)
class CategoryResponse(CategoryCreate):
    id: int

    class Config:
        from_attributes = True

# --- СХЕМИ ДЛЯ ТОВАРІВ ---


# 1. Схема для створення товару
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=3, example="AMD Ryzen 5 7600X")
    description: Optional[str] = Field(None, example="6 ядер, 12 потоків, 4.7 GHz")
    price: float = Field(..., gt=0, example=9500.0) 
    stock: int = Field(default=0, ge=0, example=15) 
    
    # ОСЬ ТУТ ЗМІНЮЄМО: дозволяємо category_id бути пустим (None)
    category_id: Optional[int] = None 
    
    image_url: Optional[str] = None

# 2. Схема для відповіді (з усіма деталями)
class ProductResponse(ProductCreate):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    full_name: Optional[str]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str        


# Схема для одного товару в кошику
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

# Схема для всього замовлення, яка прилетить з фронтенду
class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    items: List[OrderItemCreate]