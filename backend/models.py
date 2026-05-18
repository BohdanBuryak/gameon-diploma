from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    CUSTOMER = "customer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default=UserRole.CUSTOMER) # За замовчуванням всі - покупці

# Модель категорії (наприклад: Процесори, Відеокарти)
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    def __str__(self):
        return self.name
    
    # Зв'язок з товарами (одна категорія має багато товарів)
    products = relationship("Product", back_populates="category")

# Модель товару (самі комплектуючі)
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0) # Кількість на складі
    is_active = Column(Boolean, default=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    image_url = Column(String, nullable=True)

    def __str__(self):
        return self.name

    # Зв'язок з категорією
    category = relationship("Category", back_populates="products")

   



class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, index=True)
    phone = Column(String)
    address = Column(String)
    total_price = Column(Float)
    status = Column(String, default="Нове") # Нове, Оплачено, Відправлено тощо
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Зв'язок з товарами в замовленні
    items = relationship("OrderItem", back_populates="order")

    def __str__(self):
        return f"Замовлення №{self.id} — {self.customer_name}"

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float) # Фіксуємо ціну на момент покупки
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")