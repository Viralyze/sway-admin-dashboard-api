FROM node:4-onbuild

# Create app directory
RUN mkdir -p /usr/src/sway-admin-dashboard
WORKDIR /usr/src/sway-admin-dashboard

# Install server dependencies
ADD package.json /usr/src/sway-admin-dashboard
RUN npm install

# Install client dependencies
RUN cd client
ADD package.json /usr/src/sway-admin-dashboard/client
RUN npm install

# Bundle app source
ADD . .

# Expose client and server ports
EXPOSE 5000 5100

# Start app
CMD nf start web-dev,api-dev
