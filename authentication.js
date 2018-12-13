const scopes = "user:read projects:read projects:write company.projects:read";

const refreshAccessToken = (z, bundle) => {
  const promise = z.request(`https://marvelapp.com/oauth/token/`, {
    method: "POST",
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      scope: scopes
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });

  // Needs to return `access_token`. If the refresh token stays constant, can skip it. If it changes, can
  // return it here to update the user's auth on Zapier.
  return promise.then(response => {
    if (response.status !== 200) {
      throw new Error("Unable to fetch access token: " + response.content);
    }

    const result = JSON.parse(response.content);
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token
    };
  });
};

const testAuth = (z /*, bundle*/) => {
  // Normally you want to make a request to an endpoint that is either
  // specifically designed to test auth, or one that every user will have access
  // to, such as an account or profile endpoint like /me.
  const promise = z.request({
    method: "GET",
    url: "https://marvelapp.com/graphql?query={ user { email username }}"
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then(response => {
    if (response.status !== 200) {
      throw new Error("The access token you supplied is not valid");
    }

    const parsedData = z.JSON.parse(response.content);
    return parsedData.data.user;
  });
};

const authentication = {
  type: "oauth2",
  test: testAuth,
  // These variables are returned from 'testAuth'
  connectionLabel: "Marvel - {{username}} ({{email}})",
  // you can provide additional fields for inclusion in authData
  oauth2Config: {
    // "authorizeUrl" could also be a function returning a string url
    authorizeUrl: {
      method: "GET",
      url: "https://marvelapp.com/oauth/authorize",
      params: {
        state: "{{bundle.inputData.state}}",
        client_id: "{{process.env.CLIENT_ID}}",
        redirect_uri: "{{bundle.inputData.redirect_uri}}",
        scope: scopes,
        response_type: "code"
      }
    },
    // Zapier expects a response providing {access_token: 'abcd'}
    // "getAccessToken" could also be a function returning an object
    getAccessToken: {
      method: "POST",
      url: "https://marvelapp.com/oauth/token/",
      body: {
        code: "{{bundle.inputData.code}}",
        client_id: "{{process.env.CLIENT_ID}}",
        client_secret: "{{process.env.CLIENT_SECRET}}",
        redirect_uri: "{{bundle.inputData.redirect_uri}}",
        grant_type: "authorization_code"
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    },
    refreshAccessToken: refreshAccessToken,
    autoRefresh: true,

    scope: scopes
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
