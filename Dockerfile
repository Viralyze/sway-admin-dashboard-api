FROM node:4-onbuild

# Create app directory
RUN mkdir -p /usr/src/sway-admin-dashboard
WORKDIR /usr/src/sway-admin-dashboard

# Install server dependencies
COPY package.json /usr/src/sway-admin-dashboard
RUN npm install

# Install client dependencies
COPY client/package.json /usr/src/sway-admin-dashboard/client
RUN npm install

# Install Node Foreman command line tool
RUN npm install -g foreman

# Bundle app source
COPY . /usr/src/sway-admin-dashboard

# Expose client and server ports
EXPOSE 5000 5100

# Start app
CMD nf start web-dev,api-dev
