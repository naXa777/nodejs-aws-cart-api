# Stage 1: Prepare dev env
FROM node:18-alpine AS development

WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci -f
COPY --chown=node:node . .
USER node

# Stage 2: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
RUN npm ci -f --only=production && npm cache clean --force
USER node

# Stage 3: Setup the runtime container
FROM gcr.io/distroless/nodejs18-debian12 AS production

ENV NODE_ENV production
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
CMD [ "dist/main.js" ]
