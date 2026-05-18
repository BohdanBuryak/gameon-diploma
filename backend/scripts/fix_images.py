from database import SessionLocal
import models

def fix_images():
    db = SessionLocal()
    print("Оновлюємо посилання на фотографії... 🖼️")

    # Нові, стабільні посилання на фото
    updates = {
        "Процесор AMD Ryzen 5 5600X": "https://content1.rozetka.com.ua/goods/images/big/35698522.jpg",
        "Процесор Intel Core i5-13400F": "https://content1.rozetka.com.ua/goods/images/big/601083598.jpg",
        "Відеокарта NVIDIA GeForce RTX 4060 Ti 8GB": "https://artline.ua/storage/images/products/13229/gallery/162209/600_gallery_1684849268910213_0.webp",
        "Відеокарта AMD Radeon RX 7800 XT 16GB": "https://content2.rozetka.com.ua/goods/images/big/437529629.jpg",
        "Материнська плата MSI MAG B550 TOMAHAWK": "https://content.rozetka.com.ua/goods/images/big/503756864.jpg",
        "Материнська плата ASUS ROG Strix B650-A Gaming WiFi": "https://content1.rozetka.com.ua/goods/images/big/330285292.jpg",
        "Оперативна пам'ять Kingston FURY Beast 32GB (2x16GB) DDR5": "https://content2.rozetka.com.ua/goods/images/big/290600870.jpg",
        "SSD Накопичувач Samsung 980 PRO 1TB M.2": "https://content.rozetka.com.ua/goods/images/big/654906027.jpg",
        "Корпус NZXT H5 Flow Black": "https://content2.rozetka.com.ua/goods/images/big/501940415.jpg"
    }

    updated_count = 0

    for name, new_url in updates.items():
        # Шукаємо товар за назвою
        product = db.query(models.Product).filter(models.Product.name == name).first()
        if product:
            # Замінюємо старе посилання на нове
            product.image_url = new_url
            updated_count += 1

    db.commit()
    db.close()
    print(f"✅ Готово! Оновлено фотографій: {updated_count}.")

if __name__ == "__main__":
    fix_images()