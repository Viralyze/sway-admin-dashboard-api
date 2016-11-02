FROM node:4-onbuild

# Install server dependencies
ADD package.json package.json
RUN npm install

# Install client dependencies
ADD client/package.json client/package.json
RUN npm install

# Bundle app source
ADD . .

# Expose client and server ports
EXPOSE 5000 5100

# Start app
CMD nf start web-dev,api-dev
