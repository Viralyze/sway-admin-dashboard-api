FROM node:4-onbuild

MAINTAINER Alexander Nguyen

# Create app directory
RUN mkdir -p /usr/src/sway-admin-server
WORKDIR /usr/src/sway-admin-server

# Install dependencies
ADD package.json /usr/src/sway-admin-server
RUN npm install

# Bundle app source
ADD . /usr/src/sway-admin-server

# Expose port
EXPOSE 8081

# Start app
CMD npm run dev
# CMD npm start - for production
