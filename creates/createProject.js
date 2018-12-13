const _ = require("lodash");

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
          mutation createProject($projectName: String!, $companyPk: Int!) {
            createProject(input: {name: $projectName, companyPk: $companyPk}) {
              ok
              project {
                pk
                name
                prototypeUrl
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
      { key: "companyPk", label: "Company PK", required: true },
      { key: "projectName", label: "Project Name", required: true }
    ],
    perform,
    outputFields: [
      { key: "projectPk", label: "Project PK" },
      { key: "projectUrl", label: "Project URL" },
      { key: "projectName", label: "Project Name" }
    ]
  }
};
