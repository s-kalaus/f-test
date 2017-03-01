'use strict';

module.exports = {
    '/conversation': {
        'x-swagger-router-controller': 'conversation',
        get: {
            tags: ['conversation'],
            description: 'Get conversations list',
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
                    f_auth: ['conversation:list']
                }
            ]
        },
        post: {
            tags: ['conversation'],
            description: 'Add conversation',
            operationId: 'add',
            parameters: [
                {
                    name: 'member',
                    'in': 'formData',
                    description: 'Email of partner',
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
                    f_auth: ['conversation:add']
                }
            ]
        }
    },
    '/conversation/{conversationId}': {
        'x-swagger-router-controller': 'conversation',
        get: {
            tags: ['conversation'],
            description: 'Get conversation',
            operationId: 'show',
            parameters: [
                {
                    name: 'conversationId',
                    'in': 'path',
                    description: 'ID of conversation to return',
                    type: 'integer',
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
                    f_auth: ['conversation:show']
                }
            ]
        }
    }
};