FROM node

WORKDIR /app

COPY package.json .
RUN npm i -f

COPY . .

## EXPOSE [Port you mentioned in the vite.config file]

EXPOSE 5300

CMD ["npm", "run", "dev"]