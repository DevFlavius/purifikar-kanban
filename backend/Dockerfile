# Stage: builder
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Copia apenas package files para aproveitar cache do docker
COPY backend/package*.json ./ 
COPY backend/tsconfig*.json ./ 
# Copia demais arquivos do backend
COPY backend/ ./

RUN npm ci

# Gera cliente Prisma (vai escrever em node_modules/@prisma/client)
RUN npx prisma generate

# Compila TypeScript
RUN npm run build

# Remove devDependencies para reduzir tamanho (opcional)
RUN npm prune --production

# Stage: runtime
FROM node:18-bullseye-slim AS runtime
WORKDIR /app

# Copia artefatos de runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]