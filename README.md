Sway Admin Dashboard
==================================
[![Build Status](https://travis-ci.org/Viralyze/sway-admin-dashboard.svg?branch=master)](https://travis-ci.org/Viralyze/sway-admin-dashboard)

This is the admin dashboard that controls all the trading on the Sway platform. Built on ES6, Express and React.

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

Getting Started
---------------

```sh
# Clone it
git clone https://github.com/Viralyze/sway-admin-dashboard-api.git
cd sway-admin-dashboard

# Install dependencies for server and client
npm install
cd client && npm install

# Install Node Foreman command line tool
npm install -g foreman

# Start development live-reload for server and client
nf start web-dev,api-dev

# Start production server
nf start web,api

# Running tests on server
npm test

# Running tests on client
cd client && npm test
```

For Docker
---------------

Issues
---------------
- Can't seem to dockerize app when client and server are in one folder
- Foreman and Procfile are no longer used since frontend and backend are detached
