# Posts service
## Общее описание
Данный сервис предоставляет API для создания, просмотра сообщений (постов) и комментариев к ним. Сервис включает авторизацию через JWT, базу данных для хранения данных и набор API-методов.

## Инструкции по первому запуску
1. **Заполнить env переменные:** Убедитесь, что все необходимые переменные окружения заданы в соответствии с конфигурацией проекта.
2. **Запуск Docker Compose:** Выполните команду `docker compose up -d` для запуска сервисов, определённых в Docker Compose.
3. **Восстановление базы данных:** Сделайте рестор базы данных из файла `postgres.sql`.
4. **Документация API:** Доступ к документации API осуществляется по адресу `localhost:PORT/api/docs`, где `PORT` - порт, на котором запущен сервис.

## Авторизация
- **Тип авторизации:** JWT (JSON Web Tokens).
- **Payload JWT:** Содержит `id` пользователя и массив `groupIds` (идентификаторы групп, к которым пользователь имеет доступ). При необходимости, в payload могут быть добавлены дополнительные параметры.
- **Ключ** для подписи JWT необходимо указать в JWT_SECRET (при написание тестов использован ключ по умолчанию - SOME_SECRET)

## База данных
- **Модели:**
    - `posts`: Обязательные поля - `id`, `group_id`, `text`, `created_by`.
    - `comments`: Обязательные поля - `id`, `post_id`, `text`, `created_by`.
    - Можно добавить дополнительные модели и поля по необходимости.
- **Особенности:**
    - Идентификаторы групп (`group_id`) и пользователя (`created_by`) обрабатываются в другом сервисе и не включаются в текущий сервис.
    - Идентификатор группы получается из параметров запроса, а идентификатор пользователя - из JWT.
- **Инициализация.** Для создания коллекций необходимо сделать рестор из файла postgres.sql

## Структура проекта
- **api**: Контроллеры, DTO, модули API.
- **auth**: Модули аутентификации, стратегии JWT, гварды, декораторы.
- **comment**: DTO, модули, репозитории и сервисы для комментариев.
- **post**: DTO, модули, репозитории и сервисы для постов.
- **user**: Модули и сервисы пользователя.
- **database**: Модули и сервисы для работы с базой данных.
- **app.module.ts**: Главный модуль приложения.
- **main.ts**: Точка входа в приложение.

## Документация API
Документация доступна по адресу: `localhost:PORT/api/docs`
