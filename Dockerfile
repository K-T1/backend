FROM node:13.6

WORKDIR /usr/src/app

COPY . .

RUN apt-get update && \
  apt-get install -y python3-pip && \
  pip3 install -r ./requirement.txt

RUN yarn

CMD [ "yarn", "start" ]