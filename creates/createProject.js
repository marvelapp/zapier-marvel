const _ = require("lodash");
const projectFragment = require('../fragments/project');

const sample = {
  projectPk: 5,
  projectUrl: "https://marvelapp.com/3jh4a95",
  projectName: "My awesome prototype"
};

const perform = (z, bundle) => {
  return z
    .request({
      method: "POST",
      url: "https://api.marvelapp.com/graphql",
      body: {
        query: `
          ${projectFragment}
          mutation createProject($projectName: String!, $companyPk: Int) {
            createProject(input: {name: $projectName, companyPk: $companyPk}) {
              ok
              project {
                ...projectData
              }
            }
          }
        `,
        variables: _.pick(bundle.inputData, ["projectName", "companyPk"])
      }
    })
    .then(response => {
      const { data } = JSON.parse(response.content);
      return {
        projectPk: data.createProject.project.pk,
        projectUrl: data.createProject.project.prototypeUrl,
        projectName: data.createProject.project.name
      };
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
