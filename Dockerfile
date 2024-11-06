FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json  ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
