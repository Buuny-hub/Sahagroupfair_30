FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm install --production

# Copy all source files
COPY . .

# Ensure data directory and empty member store
RUN mkdir -p data && \
    [ -f data/members.json ] || echo '[]' > data/members.json

EXPOSE 3000
CMD ["node", "server.js"]
