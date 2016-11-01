FROM node:4-onbuild

# Install server dependencies
COPY package.json package.json
RUN npm install

# Install client dependencies
COPY client/package.json client/package.json
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose client and server ports
EXPOSE 5000 5100

# Start app
CMD nf start web-dev,api-dev
