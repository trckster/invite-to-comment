FROM node

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

ADD . .

RUN npx prisma generate

CMD ["yarn", "launch"]