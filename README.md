Sway Admin Dashboard
==================================
[![Build Status](https://travis-ci.org/Viralyze/sway-admin-server.svg?branch=master)](https://travis-ci.org/Viralyze/sway-admin-server)

This is the admin server that controls all the trading on the Sway platform. Built on Node, ES6, Express.

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

Getting Started
---------------

```sh
# Clone it
git clone https://github.com/Viralyze/sway-admin-server.git
cd sway-admin-server

# Install dependencies
npm install

# Run dev server
npm run dev

# Run prod server
npm start

# Running tests
npm test
```

For Docker
---------------

Issues
---------------
- Can't seem to dockerize app when client and server are in one folder
- Foreman and Procfile are no longer used since frontend and backend are detached
