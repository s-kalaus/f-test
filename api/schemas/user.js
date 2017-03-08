'use strict';

module.exports = {
    '/user': {
        'x-swagger-router-controller': 'user',
        get: {
            tags: ['user'],
            description: 'Get users list',
            operationId: 'list',
            parameters: [],
            responses: {
                200: {
                    description: 'Success',
                    schema: {
                        $ref: '#/definitions/ListResponse'
                    }
                },
                'default': {
                    description: 'Error',
                    schema: {
                        $ref: '#/definitions/ErrorResponse'
                    }
                }
            },
            security: [
                {
                    f_auth: ['user:list']
                }
            ]
        }
    },
    '/user/signin': {
        'x-swagger-router-controller': 'user',
        post: {
            tags: ['user'],
            description: 'Signin User',
            operationId: 'signin',
            parameters: [
                {
                    name: 'email',
                    'in': 'formData',
                    description: 'Email',
                    type: 'string',
                    required: true
                },
                {
                    name: 'name',
                    'in': 'formData',
                    description: 'Name',
                    type: 'string',
                    required: true
                },
                {
                    name: 'password',
                    'in': 'formData',
                    description: 'Password',
                    type: 'string',
                    required: true
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    schema: {
                        $ref: '#/definitions/SuccessResponse'
                    }
                },
                'default': {
                    description: 'Error',
                    schema: {
                        $ref: '#/definitions/ErrorResponse'
                    }
                }
            }
        }
    },
    '/user/{userId}': {
        'x-swagger-router-controller': 'user',
        get: {
            tags: ['user'],
            description: 'Get user',
            operationId: 'show',
            parameters: [
                {
                    name: 'userId',
                    'in': 'path',
                    description: 'ID of user to return Or "me"',
                    type: 'string',
                    required: true
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    schema: {
                        $ref: '#/definitions/SuccessResponse'
                    }
                },
                'default': {
                    description: 'Error',
                    schema: {
                        $ref: '#/definitions/ErrorResponse'
                    }
                }
            },
            security: [
                {
                    f_auth: ['user:show']
                }
            ]
        }
    }
};