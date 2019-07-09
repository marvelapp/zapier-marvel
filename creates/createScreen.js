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
    description: "Creates a screen within a project & uploads an image",
    important: true,
  },

  operation: {
    sample,
    inputFields: [
      { key: "projectPk", label: "Project ID", required: true, type: 'integer' },
      { key: "screenName", label: "Screen Name", required: false },
      { key: "imageURL", label: "Image URL", required: false },
    ],
    perform,
    outputFields: [
      { key: 'id', 'label': 'Screen ID', type: 'integer' },
      { key: 'externalId', 'label': 'External ID' },
      { key: 'uuid', 'label': 'UUID' },
      { key: 'name', 'label': 'Name' },
      { key: 'displayName', 'label': 'Display Name' },
      { key: 'createdAt', 'label': 'Created At', type: 'datetime' },
      { key: 'modifiedAt', 'label': 'Modified At', type: 'datetime' },
      { key: 'sourcePlatform', 'label': 'Source Platform' },
      { key: 'uploadUrl', 'label': 'Upload URL' },
      { key: 'content', children: [
        { key: 'filename', label: 'Filename' },
        { key: 'url', label: 'URL' },
        { key: 'height', label: 'Height', type: 'integer' },
        { key: 'width', label: 'Width', type: 'integer' },
      ]},
    ]
  }
};
