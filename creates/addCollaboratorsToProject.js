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
      email: "blah@marvelapp.com",
      message: "User does not exist",
      code: "USER_DOES_NOT_EXIST"
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
      collaborators: bundle.inputData.collaborators,
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
      { key: "projectPk", label: "Project ID", required: true, type: "integer" },
      {
        key: "collaborators",
        label: "Collaborator email addresses",
        required: true,
        list: true,
      }
    ],
    outputFields: [
      { key: "succeeded", label: "Succeeded", children: [
        { key: "username", label: "Username" },
        { key: "email", label: "Email" },
      ] },
      { key: "failed", label: "Failed", children: [
        { key: "email", label: "Email" },
        { key: "message", label: "Error message" },
        { key: "code", label: "Error code" },
      ] }
    ]
  }
};
