# Базовый образ для Node.js
FROM node:18-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    curl \
    && apt-get clean

# Установка pnpm
RUN npm install -g pnpm

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Отладка: проверяем наличие файлов в /app
RUN echo "Содержимое директории /app после копирования package.json и package-lock.json:" && ls -la /app

# Копируем файл chartiq-9.4.0.tgz из корневой директории
COPY chartiq-9.4.0.tgz ./

# Отладка: проверяем наличие файла chartiq-9.4.0.tgz
RUN echo "Содержимое директории /app после копирования chartiq-9.4.0.tgz:" && ls -la /app

# Устанавливаем зависимости через pnpm с принудительной установкой
RUN pnpm install --force

# Проверяем, что зависимости установлены
RUN pnpm list --depth 0

# Проверка версии http-server
RUN npx http-server --version
RUN echo "мы же прошли этот этап?!"

# Копируем остальные файлы проекта
COPY . .

# Отладка: проверяем содержимое директории после копирования всех файлов
RUN echo "Содержимое директории /app после копирования всех файлов проекта:" && ls -la /app

# Открываем порт для приложения
EXPOSE 3000

# Команда для запуска приложения
CMD ["pnpm", "start"]
