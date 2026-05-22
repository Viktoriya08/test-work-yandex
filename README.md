

# Тестовое задание Гнездилова Виктория

**Верстка** - [https://viktoriya08.github.io/test-work-yandex/docs/sitemap.html](https://viktoriya08.github.io/test-work-yandex/docs/sitemap.html)

**Макет** - [https://www.figma.com/design/47NJTyJA7JlO9hEwnGM2HI/%D0%94%D0%B8%D0%B7%D0%B0%D0%B8%CC%86%D0%BD_%D0%B4%D0%BB%D1%8F_%D0%B2%D0%B5%D1%80%D1%81%D1%82%D0%BA%D0%B8_%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B8%CC%86_%D0%BB%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D0%B3?node-id=2-498&t=sNbOWw2qZOPZdiyB-0](https://www.figma.com/design/47NJTyJA7JlO9hEwnGM2HI/%D0%94%D0%B8%D0%B7%D0%B0%D0%B8%CC%86%D0%BD_%D0%B4%D0%BB%D1%8F_%D0%B2%D0%B5%D1%80%D1%81%D1%82%D0%BA%D0%B8_%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B8%CC%86_%D0%BB%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D0%B3?node-id=2-498&t=sNbOWw2qZOPZdiyB-0)

## Начало работы

Установка npm зависимостей

### Требования
- `node-version: 18.x`

### Установка
- `npm i` – установка всех проектных зависимостей
- `npm run start` – запуск локального сервера в `dev-моде`
- `npm run build` или `npm build` – компиляция миницированных файлов, без запуска сервера.

### Скрипты
- `npm run lint:scss` – линтинг SCSS
- `npm run lint:ts` – линтинг JS
- `npm run lint:pug` – линтинг PUG
- `npm run test` – проверить всё
- `npm run vite` – старт дев-сервера, но без дополнительного отслеживания изменений в картинках и иконках
- `npm run vite:build` – полная сборка, подготовка `production-версии` проекта
- `npm run vite:preview`: – превью `production-версии` проекта (рекомендуется запускать после выполнения команды `npm run vite:preview`)
