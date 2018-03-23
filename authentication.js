'use strict';

const authentication = {
  type: 'custom',
  // "test" could also be a function
  test: {
    url:
      'https://marvelapp.com/graphql?query={ user { email }}'
  },
  fields: [
    {
      key: 'access_token',
      type: 'string',
      required: true,
      helpText: 'Found on https://marvelapp.com/oauth/devtoken'
    }
  ]
};

module.exports = authentication;
