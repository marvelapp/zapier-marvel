const _ = require("lodash");
const projectFragment = require('../fragments/project');
const { gqlRequest } = require('../api');

const sample = {
  projectPk: 5,
  projectUrl: "https://marvelapp.com/3jh4a95",
  projectName: "My awesome prototype"
};

const perform = (z, bundle) => {
  const query =  `
      ${projectFragment}
      mutation zapierCreateProject($projectName: String!, $companyPk: Int) {
        createProject(input: {name: $projectName, companyPk: $companyPk}) {
          ok
          project {
            ...projectData
          }
        }
      }
    `;

  const variables = _.pick(bundle.inputData, ["projectName", "companyPk"]);

  return gqlRequest(z, bundle, query, variables).then(response => {
    const { data } = JSON.parse(response.content);
    return data.createProject.project;
  });
};

module.exports = {
  key: "project",
  noun: "Project",

  display: {
    label: "Create Project",
    description: "Creates a project."
  },

  operation: {
    sample,
    inputFields: [
      { key: "companyPk", label: "Company PK", required: false },
      { key: "projectName", label: "Project Name", required: true }
    ],
    perform,
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'uuid', label: 'UUID' },
      { key: 'name', label: 'Name' },
      { key: 'prototypeUrl', label: 'Prototype URL' },
      { key: 'isArchived', label: 'Is Archived' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'modifiedAt', label: 'Modified At' },
    ]
  }
};
