# 1. Usa una imagen base oficial de Node.js
FROM node:14

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# 4. Instala las dependencias de la aplicación
RUN npm install

# 5. Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# 6. Expone el puerto en el que tu aplicación va a correr (por ejemplo, 3020)
EXPOSE 3020

# 7. Comando para iniciar la aplicación
CMD ["node", "servidordirectorio.js"]