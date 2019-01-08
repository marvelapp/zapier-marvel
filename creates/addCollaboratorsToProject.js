const _ = require("lodash");

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
  return z
    .request({
      method: "POST",
      url: "https://api.marvelapp.com/graphql",
      body: {
        query: `
          mutation zapierAddCollaboratorsToProject($projectPk: Int!, $collaborators: [String!]!) {
            addCollaboratorsToProject(input: {projectPk: $projectPk, emails: $collaborators}) {
              succeeded {
                username
                email
              }
              failed {
                email
                message
              }
            }
          }
        `,
        variables: {
          projectPk: bundle.inputData.projectPk,
          // Accepting a comma delimited array for now since I can't figure out
          // how passing arrays around work in zapier.
          collaborators: bundle.inputData.collaborators.split(",")
        }
      }
    })
    .then(response => {
      const { data } = JSON.parse(response.content);
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
