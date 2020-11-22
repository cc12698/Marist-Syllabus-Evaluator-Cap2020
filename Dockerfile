FROM node:8-stretch

# Change working directory
WORKDIR /app

# Update packages and install dependency packages for services
RUN apt-get update \
 && apt-get dist-upgrade -y \
 && apt-get clean \
 && apt-get install -y python3-pip python3-dev \
 && echo 'Finished installing dependencies'

# Install npm production packages
COPY package.json /app/
RUN cd /app; npm install --production

COPY ./requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt

COPY . /app

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]
