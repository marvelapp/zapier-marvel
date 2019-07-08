const _ = require("lodash");
const { gqlRequest } = require('../api');

const sample = {
  succeeded: [
    {
      username: "tk",
      email: "tommy@marvelapp.com"
    }
  ],
  failed: [
    {
      email: "nish@marvelapp.com",
      message: "Some error"
    }
  ]
};

const perform = (z, bundle) => {
  const query = `
    mutation zapierAddCollaboratorsToProject($projectPk: Int!, $collaborators: [String!]!) {
      addCollaboratorsToProject(input: {projectPk: $projectPk, emails: $collaborators}) {
        succeeded {
          username
          email
        }
        failed {
          email
          message
          code
        }
      }
    }
  `;
  const variables = {
      projectPk: bundle.inputData.projectPk,
      // Accepting a comma delimited array for now since I can't figure out
      // how passing arrays around work in zapier.
      collaborators: bundle.inputData.collaborators.split(",")
  }
  return gqlRequest(z, bundle, query, variables)
    .then(response => {
      const { data, errors } = JSON.parse(response.content);
      if (errors || !data) {
        throw new Error(`Could not create screen: ${errors[0].message}`)
      }
      return {
        succeeded: data.addCollaboratorsToProject.succeeded,
        failed: data.addCollaboratorsToProject.failed
      };
    });
};

module.exports = {
  key: "addCollaboratorsToProject",
  noun: "Add collabborators to project",

  display: {
    label: "Add Collaborators to Project",
    description: "Add collaborators to a project."
  },

  operation: {
    sample,
    perform,
    inputFields: [
      { key: "projectPk", label: "Project PK", required: true },
      {
        key: "collaborators",
        label: "Collaborators",
        required: true
      }
    ],
    outputFields: [
      { key: "succeeded", label: "Succeeded" },
      { key: "failed", label: "Failed" }
    ]
  }
};
