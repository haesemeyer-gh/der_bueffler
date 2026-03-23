FROM node:24.14.0-alpine
WORKDIR /app
COPY ./backend/.env ./backend/package.json ./backend/package-lock.json ./
COPY ./backend/key_generator.js ./
COPY ./backend/server.js ./server.js
RUN mkdir modules
COPY ./backend/modules ./modules
RUN mkdir frontend
COPY frontend ./frontend
RUN npm ci --only=production
EXPOSE 3000
#CMD ["ping", "1.1.1.1"]
CMD ["node", "server.js"]

