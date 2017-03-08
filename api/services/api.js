'use strict';

/* global __dirname */

var SwaggerExpress = require('swagger-express-mw');
var _ = require('lodash');
var express = require('express');
var qs = require('querystring');
var AuthService = require('./auth');

var ApiService = function(app, config) {

    this.app = app;
    this.config = config;

    this.authService = new AuthService(config);
};

ApiService.prototype.getSchema = function() {

    return {
        swagger: '2.0',
        info: {
            version: '1.0.0',
            title: 'F-Test API'
        },
        host: this.config.server.host,
        basePath: '/api/v1',
        schemes: [
            'http',
            'https'
        ],
        consumes: [
            'application/json',
            'application/x-www-form-urlencoded'
        ],
        produces: [
            'application/json'
        ],
        securityDefinitions: {
            f_auth: {
                type: 'oauth2',
                authorizationUrl: this.config.server.protocol + '://' + this.config.server.host + '/api/v1/oauth',
                flow: 'implicit',
                scopes: {
                    'conversation:list': 'Get conversations',
                    'conversation:show': 'Get conversation',
                    'conversation:add': 'Add conversation',
                    'message:list': 'Get messages',
                    'message:add': 'Add message',
                    'user:show': 'Get user',
                    'user:list': 'Get lists'
                }
            }
        },
        tags: [
            { name: 'conversation' },
            { name: 'message' },
            { name: 'user' }
        ],
        paths: _.extend({},
            require('../schemas/conversation'),
            require('../schemas/message'),
            require('../schemas/user')
        ),
        definitions: {
            ErrorResponse: {
                required: [
                    'success',
                    'message'
                ],
                properties: {
                    success: {
                        type: 'boolean'
                    },
                    code: {
                        type: 'string'
                    },
                    message: {
                        type: 'string'
                    }
                }
            },
            SuccessResponse: {
                required: [
                    'success'
                ],
                properties: {
                    success: {
                        type: 'boolean'
                    }
                }
            },
            ListResponse: {
                required: [
                    'success',
                    'data'
                ],
                properties: {
                    success: {
                        type: 'boolean'
                    },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object'
                        }
                    }
                }
            }
        }
    };
};

ApiService.prototype.setup = function() {

    var _self = this;

    var swaggerConfig = {
        appRoot: __dirname + '/../..',
        swagger: this.getSchema(),
        swaggerControllerPipe: 'swagger_controllers',
        bagpipes: {
            _router: {
                name: 'swagger_router',
                mockMode: false,
                mockControllersDirs: [ 'api/mocks' ],
                controllersDirs: [ 'api/controllers' ]
            },
            _swagger_validate: {
                name: 'swagger_validator',
                validateReponse: true
            },
            swagger_controllers: [
                {
                    onError: 'error_handler'
                },
                'cors',
                'swagger_security',
                '_swagger_validate',
                'express_compatibility',
                '_router'
            ]
        },
        swaggerSecurityHandlers: {
            f_auth: function(req, authOrSecDef, scopesOrApiKey, callback) {

                return _self.authService.oauthAuthorize({
                    req: req,
                    scope: scopesOrApiKey
                }, function(result) {

                    if (!result || !result.success) {
                        return callback({success: false, message: result && result.message ? result.message : 'Unknown error'});
                    }

                    return callback();
                });
            }
        }
    };

    var docsHandler = express.static(__dirname + '/../../node_modules/swagger-tools/middleware/swagger-ui');

    SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

        if (err) { throw err; }

        swaggerExpress.register(_self.app);
    });

    // Swagger UI
    this.app.get('/api/v1', function(req, res) {

        return res.render('swagger', {
            url: _self.config.server.protocol + '://' + _self.config.server.host
        });
    });

    // Swagger API schema
    this.app.get('/api/v1/schema', function(req, res) {

        return res.json(_self.getSchema());
    });

    // Swagger Auth Callback
    this.app.get('/api/v1/o2c', function(req, res) {

        return res.render('o2c');
    });

    this.app.get('/api/v1/oauth', function(req, res) {

        req.query.url = '/api/v1/oauth?' + qs.stringify(req.query);

        return res.render('oauth', req.query);
    });

    this.app.post('/api/v1/oauth', function(req, res) {

        return _self.authService.oauthCreateToken(req.body, function(result) {

            if (!result || !result.success) {

                req.body.error = result && result.message ? result.message : 'Unhandled error';
                req.body.url = '/api/v1/oauth?' + qs.stringify(req.body);

                return res.render('oauth', req.body);
            }

            return res.redirect(result.redirect_uri + '?access_token=' + result.token + '&state=' + result.state);
        });
    });

    // Swagger Statics
    this.app.get(/^\/api\/(css|lib|swagger|images|fonts)/, function(req, res, next) {

        req.url = req.url.substr(4) || '/';

        return docsHandler(req, res, next);
    });
};

module.exports = ApiService;

