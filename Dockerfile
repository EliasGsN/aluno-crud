# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para instalar dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todo o código do projeto para o container
COPY . .

# Expõe a porta 3000 para acessar o backend
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
