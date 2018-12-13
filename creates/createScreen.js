const _ = require("lodash");
const FormData = require('form-data');
const request = require('request');


const screenFragment = require('../fragments/screen');
const sample = require('../samples/sample_screen');

const perform = (z, bundle) => {
  return z
    .request({
      method: "POST",
      url: "https://api.marvelapp.com/graphql",
      body: {
        query: `
          ${screenFragment}
          mutation createScreen($screenName: String, $projectPk: Int!) {
            createScreen(input: {name: $screenName, projectPk: $projectPk}) {
              ok
              screen {
                ...screenInfo
              }
            }
          }
        `,
        variables: _.pick(bundle.inputData, ["screenName", "projectPk"])
      }
    })
    .then(response => {
      const { data } = JSON.parse(response.content);
      return data.createScreen;
    }).then(data => {
      const screenData = data.screen;
      if (!bundle.inputData.imageURL) {
        return screenData;
      }

      const form = new FormData();
      form.append('file', request(bundle.inputData.imageURL));
      return z.request({
        url: screenData.uploadUrl,
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
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
