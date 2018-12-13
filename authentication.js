const authentication = {
  type: 'oauth2',
  connectionLabel: "Marvel - {{ bundle.authData.data.user.username }} ({{ bundle.authData.data.user.username }})",
  test: {
    url:
      'https://marvelapp.com/graphql?query={ user { email username }}'
  },
  // you can provide additional fields for inclusion in authData
  oauth2Config: {
    // "authorizeUrl" could also be a function returning a string url
    authorizeUrl: {
      method: 'GET',
      url: 'https://marvelapp.com/oauth/authorize',
      params: {
        state: '{{bundle.inputData.state}}',
        client_id: '{{process.env.CLIENT_ID}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        scope: 'user:read projects:write projects:read',
        response_type: 'code'
      }
    },
    // Zapier expects a response providing {access_token: 'abcd'}
    // "getAccessToken" could also be a function returning an object
    getAccessToken: {
      method: 'POST',
      url:
        'https://marvelapp.com/oauth/token/',
      body: {
        code: '{{bundle.inputData.code}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        grant_type: 'authorization_code'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    scope: 'user:read projects:write projects:read',
  },
  // If you need any fields upfront, put them here
  fields: [
    // { key: 'subdomain', type: 'string', required: true, default: 'app' }
    // For OAuth2 we store `access_token` and `refresh_token` automatically
    // in `bundle.authData` for future use. If you need to save/use something
    // that the user shouldn't need to type/choose, add a "computed" field, like:
    // {key: 'user_id': type: 'string', required: false, computed: true}
    // And remember to return it in oauth2Config.getAccessToken/refreshAccessToken
  ]
};


module.exports = authentication;
