
FROM node:18-buster

WORKDIR /app

# Обновляем список пакетов и устанавливаем клиент MySQL
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Копируем файлы package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Открываем порт, который будет использоваться сервером
EXPOSE 3006

# Запускаем приложение с помощью ts-node через nodemon для разработки
CMD ["npx", "nodemon", "-L", "--watch", "src", "--ext", "ts", "--exec", "ts-node", "src/index.ts"]