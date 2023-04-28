FROM node:16-alpine AS build

WORKDIR /app

COPY . .

# RUN npm install glob rimraf

# Install dependencies
RUN npm ci

# Build the app
RUN npm run build

# Prune devDependencies
RUN npm prune --production

# Start service stage
FROM node:16-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package*.json /app/
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules

EXPOSE 5000

CMD ["node", "dist/main.js"]