# Nexora Store

> Адаптивный интернет-магазин электроники и товаров для дома для рынка Узбекистана.

## Стек технологий
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Стилизация:** Custom CSS Design System (Bento Grid, dark navy/violet palette `#0A0E1A`, `#131B2E`, cyan glow `#00E5FF`, coral CTA `#FF4D4D`, micro-animations, reduced-motion)
- **База данных и ORM:** Prisma ORM (SQLite для мгновенного локального запуска без внешних зависимостей / PostgreSQL-совместимый)
- **Безопасность и Auth:** Сессии, безопасное хеширование паролей, разделение ролей (`customer`, `admin`), валидация всех данных на сервере

## Документация проекта
- [PRD.md](./PRD.md) — Продуктовые требования и сценарии
- [SPEC.md](./SPEC.md) — Функциональная и техническая спецификация
- [TASKS.md](./TASKS.md) — Пошаговый план разработки
- [TASKS_GUIDE.md](./TASKS_GUIDE.md) — Руководство по выполнению задач

## Быстрый старт
```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env

# Инициализация базы данных
npx prisma db push
npx prisma db seed

# Запуск dev-сервера
npm run dev
```
Сервер будет доступен по адресу `http://localhost:3000`.
