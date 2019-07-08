const _ = require("lodash");
const { gqlRequest } = require('../api');
const FormData = require('form-data');
const request = require('request');


const screenFragment = require('../fragments/screen');
const sample = require('../samples/sample_screen');

const perform = (z, bundle) => {
  const query = `
    ${screenFragment}
    mutation createScreen($screenName: String, $projectPk: Int!) {
      createScreen(input: {name: $screenName, projectPk: $projectPk}) {
        ok
        screen {
          ...screenInfo
        }
      }
    }`;
    const variables = _.pick(bundle.inputData, ["screenName", "projectPk"]);

  return gqlRequest(z, bundle, query, variables).then(response => {
      const { data, errors } = JSON.parse(response.content);
      if (errors || !data || !data.createScreen || !data.createScreen.ok) {
        throw new Error(`Could not create screen: ${errors[0].message}`)
      }
      return data.createScreen;
    }).then(data => {
      const screenData = data.screen;
      if (!bundle.inputData.imageURL) {
        return screenData;
      }

      const form = new FormData();
      const headers = form.getHeaders();
      // manually add the bearer token because we can't use the gqlRequest helper
      headers.Authorization = `Bearer ${bundle.authData.access_token}`;

      form.append('file', request(bundle.inputData.imageURL));
      return z.request({
        url: screenData.uploadUrl,
        method: 'POST',
        body: form,
        headers: headers,
      }).then(() => {
        // todo: refetch screen data with updated image
        return screenData;
      })
    });
};

module.exports = {
  key: "screen",
  noun: "Screen",

  display: {
    label: "Create a Screen",
    description: "Creates a screen within a project & uploads an image"
  },

  operation: {
    sample,
    inputFields: [
      { key: "projectPk", label: "Project ID", required: true },
      { key: "screenName", label: "Screen Name", required: false },
      { key: "imageURL", label: "Image URL", required: false },
    ],
    perform,
    outputFields: [
    ]
  }
};
