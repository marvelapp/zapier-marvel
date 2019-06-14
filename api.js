const gqlRequest = (z, bundle, query, variables) => {
  return z.request({
    method: "POST",
    url: "https://api.marvelapp.com/graphql",
    headers: {
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
    body: {
      query: query,
      variables: variables,
    }
  }).catch(error => {
    z.console.log('whattt')
    throw error;
  })
}


module.exports = {
  gqlRequest: gqlRequest,
}
