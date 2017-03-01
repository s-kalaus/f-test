'use strict';

module.exports = {
    '/conversation/{conversationId}/message': {
        'x-swagger-router-controller': 'message',
        get: {
            tags: ['message'],
            description: 'Get conversation\'s messages list',
            operationId: 'list',
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
                    f_auth: ['message:list']
                }
            ]
        },
        post: {
            tags: ['message'],
            description: 'Add conversation\'s message',
            operationId: 'add',
            parameters: [
                {
                    name: 'conversationId',
                    'in': 'path',
                    description: 'ID of conversation to return',
                    type: 'integer',
                    required: true
                },
                {
                    name: 'message',
                    'in': 'formData',
                    description: 'Message',
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
                    f_auth: ['message:add']
                }
            ]
        }
    }
};