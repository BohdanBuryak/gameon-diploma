from database import SessionLocal, engine, Base
import models

def seed_db():
    db = SessionLocal()
    print("Запуск безпечного наповнення бази даних GameOn... 🚀")
    print("Перевірка категорій та товарів без видалення існуючих даних (замовлення в безпеці!).")

    # 1. Список необхідних категорій
    required_categories = {
        "cpu": "Процесори",
        "gpu": "Відеокарти",
        "mobo": "Материнські плати",
        "ram": "Оперативна пам'ять",
        "ssd": "Накопичувачі",
        "case": "Корпуси"
    }
    
    category_mapping = {}

    # Розумна перевірка категорій
    for key, cat_name in required_categories.items():
        existing_cat = db.query(models.Category).filter(models.Category.name == cat_name).first()
        if existing_cat:
            category_mapping[key] = existing_cat.id
            print(f"ℹ️ Категорія '{cat_name}' вже існує (ID: {existing_cat.id}). Використовуємо її.")
        else:
            new_cat = models.Category(name=cat_name)
            db.add(new_cat)
            db.commit()
            db.refresh(new_cat)
            category_mapping[key] = new_cat.id
            print(f"➕ Створено нову категорію: '{cat_name}' (ID: {new_cat.id}).")

    # 2. Список товарів для додавання
    products_to_add = [
        # ПРОЦЕСОРИ
        {
            "name": "Процесор AMD Ryzen 5 5600X",
            "description": "Ідеальний вибір для ігор у 1080p та 1440p. 6 ядер, 12 потоків, частота до 4.6 ГГц. Висока продуктивність за розумні гроші.",
            "price": 6299, "stock": 15, "cat_key": "cpu",
            "image_url": "https://m.media-amazon.com/images/I/61vGQNUEsGL._AC_SX679_.jpg"
        },
        {
            "name": "Процесор Intel Core i5-13400F",
            "description": "Нове покоління Intel. 10 ядер (6 продуктивних, 4 енергоефективних), 16 потоків. Відмінно підходить для стрімінгу та ігор.",
            "price": 8499, "stock": 8, "cat_key": "cpu",
            "image_url": "https://m.media-amazon.com/images/I/61yB13A5ZKL._AC_SX679_.jpg"
        },
        
        # ВІДЕОКАРТИ
        {
            "name": "Відеокарта NVIDIA GeForce RTX 4060 Ti 8GB",
            "description": "DLSS 3.0, генерація кадрів та неймовірний рейтрейсинг. Ця карта потягне будь-яку сучасну гру на ультра налаштуваннях.",
            "price": 18999, "stock": 5, "cat_key": "gpu",
            "image_url": "https://m.media-amazon.com/images/I/71N-4d8wRTL._AC_SX679_.jpg"
        },
        {
            "name": "Відеокарта AMD Radeon RX 7800 XT 16GB",
            "description": "Справжній монстр для 2K геймінгу. 16 ГБ пам'яті дозволят забути про просадки FPS на найближчі 5 років.",
            "price": 23500, "stock": 3, "cat_key": "gpu",
            "image_url": "https://m.media-amazon.com/images/I/81xU-k9-sUL._AC_SX679_.jpg"
        },

        # МАТЕРИНСЬКІ ПЛАТИ
        {
            "name": "Материнська плата MSI MAG B550 TOMAHAWK",
            "description": "Надійна основа для вашої збірки. Масивні радіатори, підтримка PCIe 4.0 та два слоти M.2.",
            "price": 6100, "stock": 10, "cat_key": "mobo",
            "image_url": "https://m.media-amazon.com/images/I/910-YkXfAHL._AC_SX679_.jpg"
        },
        {
            "name": "Материнська плата ASUS ROG Strix B650-A Gaming WiFi",
            "description": "Стильна біла плата під сокет AM5. Підтримка DDR5, вбудований Wi-Fi 6E та круте підсвічування Aura Sync.",
            "price": 10500, "stock": 4, "cat_key": "mobo",
            "image_url": "https://m.media-amazon.com/images/I/81fU7FqF09L._AC_SX679_.jpg"
        },

        # ОПЕРАТИВНА ПАМ'ЯТЬ
        {
            "name": "Оперативна пам'ять Kingston FURY Beast 32GB (2x16GB) DDR5",
            "description": "Частота 6000 МГц, низькі таймінги. Ідеально для систем на базі нових Ryzen та Intel Core.",
            "price": 4800, "stock": 20, "cat_key": "ram",
            "image_url": "https://m.media-amazon.com/images/I/61kDFDMBx-L._AC_SX679_.jpg"
        },
        
        # НАКОПИЧУВАЧІ
        {
            "name": "SSD Накопичувач Samsung 980 PRO 1TB M.2",
            "description": "Швидкість читання до 7000 МБ/с. Windows завантажується за секунди, а ігри літають без підзавантажень текстур.",
            "price": 3900, "stock": 12, "cat_key": "ssd",
            "image_url": "https://m.media-amazon.com/images/I/718b9wDUSwL._AC_SX679_.jpg"
        },

        # КОРПУСИ
        {
            "name": "Корпус NZXT H5 Flow Black",
            "description": "Мінімалістичний дизайн, ідеальна продувність. Оснащений спеціальним вентилятором для охолодження відеокарти.",
            "price": 3800, "stock": 7, "cat_key": "case",
            "image_url": "https://m.media-amazon.com/images/I/719FvY24AHL._AC_SX679_.jpg"
        }
    ]

    products_added = 0

    # Розумна перевірка товарів
    for p in products_to_add:
        existing_prod = db.query(models.Product).filter(models.Product.name == p["name"]).first()
        if existing_prod:
            print(f"ℹ️ Товар '{p['name']}' вже є в базі. Пропускаємо.")
        else:
            new_prod = models.Product(
                name=p["name"],
                description=p["description"],
                price=p["price"],
                stock=p["stock"],
                category_id=category_mapping[p["cat_key"]],
                image_url=p["image_url"]
            )
            db.add(new_prod)
            products_added += 1
            print(f"➕ Додано товар: '{p['name']}'")

    db.commit()
    db.close()
    print(f"✅ Готово! Усі існуючі замовлення збережені. Додано нових товарів: {products_added}.")

if __name__ == "__main__":
    seed_db()