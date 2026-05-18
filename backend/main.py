from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from sqladmin import Admin, ModelView
import models
import schemas
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import auth
from auth import get_current_admin 
from ai_service import get_pc_recommendation
from pydantic import BaseModel

# Створи схему для запиту
class AIRequest(BaseModel):
    query: str

# Створюємо всі таблиці в базі даних
Base.metadata.create_all(bind=engine)

# === ОСЬ ТУТ СТВОРЮЄТЬСЯ APP ===
# Все, що починається на @app, має бути строго НИЖЧЕ цього рядка!
app = FastAPI(
    title="GameOn API",
    description="API для системи конфігурування комп'ютерної техніки",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- АДМІН-ПАНЕЛЬ ---
admin = Admin(app, engine)

class CategoryAdmin(ModelView, model=models.Category):
    column_list = [models.Category.id, models.Category.name]
    icon = "fa-solid fa-list"

class ProductAdmin(ModelView, model=models.Product):
    column_list = [models.Product.id, models.Product.name, models.Product.price, models.Product.stock]
    icon = "fa-solid fa-microchip"

# Додаємо управління користувачами в адмінку
class UserAdmin(ModelView, model=models.User):
    column_list = [models.User.id, models.User.email, models.User.full_name, models.User.role]
    icon = "fa-solid fa-users"

# ДОДАЄМО КЛАС ДЛЯ ГОЛОВНИХ ЗАМОВЛЕНЬ
class OrderAdmin(ModelView, model=models.Order):
    column_list = [
        models.Order.id, 
        models.Order.customer_name, 
        models.Order.phone, 
        models.Order.address,
        models.Order.total_price, 
        models.Order.status, 
        models.Order.created_at
    ]
    icon = "fa-solid fa-file-invoice-dollar"
    name = "Замовлення"
    name_plural = "Замовлення"

# ДОДАЄМО КЛАС ДЛЯ ТОВАРІВ У ЗАМОВЛЕННЯХ
class OrderItemAdmin(ModelView, model=models.OrderItem):
    column_list = [
        models.OrderItem.id, 
        models.OrderItem.order,    
        models.OrderItem.product, 
        models.OrderItem.quantity, 
        models.OrderItem.price
    ]
    icon = "fa-solid fa-boxes-stacked"
    name = "Деталі замовлень"
    name_plural = "Деталі замовлень"

admin.add_view(CategoryAdmin)
admin.add_view(ProductAdmin)
admin.add_view(UserAdmin)
admin.add_view(OrderAdmin)
admin.add_view(OrderItemAdmin)

@app.get("/")
async def root():
    return {"message": "Welcome to GameOn API! Server is running 🚀"}

@app.get("/api/v1/status")
async def check_status(db: Session = Depends(get_db)):
    return {
        "status": "ok",
        "database": "connected 🟢",
        "ai_module": "standby"
    }


# === РОУТИ ДЛЯ ШІ ===

@app.post("/api/v1/ai/recommend")
async def ai_recommend(request: AIRequest):
    # Ми більше не робимо запит до БД (db.query...)
    # Просто передаємо текст користувача до нашого вільного ШІ
    recommendation = get_pc_recommendation(request.query)
    
    return {"recommendation": recommendation}
# === РОУТИ ДЛЯ КАТЕГОРІЙ ===

@app.post("/api/v1/categories/", response_model=schemas.CategoryResponse)
def create_category(
    category: schemas.CategoryCreate, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin)
):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/api/v1/categories/", response_model=list[schemas.CategoryResponse])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Category).offset(skip).limit(limit).all()

# === РОУТИ ДЛЯ ТОВАРІВ ===

@app.post("/api/v1/products/", response_model=schemas.ProductResponse)
def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin)
):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/api/v1/products/", response_model=list[schemas.ProductResponse])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Product).offset(skip).limit(limit).all()

@app.get("/api/v1/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    # Шукаємо товар за його ID
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    # Якщо такого товару немає - віддаємо помилку 404
    if not product:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
        
    return product


# === РОУТИ ДЛЯ ЗАМОВЛЕНЬ ===

@app.post("/api/v1/orders/")
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # 1. Рахуємо загальну суму на бекенді (щоб ніхто не підробив ціну на фронтенді)
    total = 0
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            total += product.price * item.quantity

    # 2. Створюємо головний запис замовлення
    db_order = models.Order(
        customer_name=order.customer_name,
        phone=order.phone,
        address=order.address,
        total_price=total
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # 3. Додаємо всі товари з кошика до цього замовлення і списуємо їх зі складу
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            db_item = models.OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price
            )
            db.add(db_item)
            
            # Зменшуємо кількість товару на складі
            if product.stock >= item.quantity:
                product.stock -= item.quantity
            else:
                product.stock = 0
                
    db.commit()
    
    return {
        "message": "Замовлення успішно створено!", 
        "order_id": db_order.id, 
        "total_price": total
    }



# === AUTH РОУТИ ===

@app.post("/api/v1/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email вже зареєстрований")
    
    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email, 
        hashed_password=hashed_pwd, 
        full_name=user.full_name,
        role="customer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/v1/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Невірний email або пароль"
        )
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}