f-test
===============

Built using AngularJS, node.js, swagger.io, gulp assembling

Demo: http://f-test.kalaus.ru/

Demo API: http://f-test.kalaus.ru/api/v1

===============
#Installation

* npm install
* bower install

### Execution

development:

    # frontend
    gulp watch

    # backend
    npm start

    # configure nginx with .nginx.conf & port 5567

production:

    # frontend
    gulp production

    # backend
    NODE_ENV=production npm start

    # configure nginx with .nginx.conf & port 5567

test:

    # frontend karma
    npm run test-ui

    # backend mocha
    npm test

### Development

Point document root of webserver to directory with app. Open SERVER_NAME in browser. Sample nginx config in root folder

### How to use

1. Login with any valid email and password in 1st browser
2. Login with other valid email and password in 2nd browser
3. Type 1st user's email, a message and hit enter
4. In 1st browser message from 2nd browser should appear

All data is stored in MOCK models