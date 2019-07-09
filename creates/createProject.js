const _ = require("lodash");
const projectFragment = require('../fragments/project');
const { gqlRequest } = require('../api');

const sample = {
  createdAt: new Date('2019-07-09T15:28:29.015Z'),
  id: 4187709,
  isArchived: false,
  modifiedAt: new Date('2019-07-09T15:28:29.016Z'),
  name: 'Test name',
  prototypeUrl: 'https://marvelapp.com/41h5g02',
  passwordProtected: false,
  settings: { deviceFrame: 'WEB', portrait: true },
  uuid: '48d0c575-3bcc-4e7c-a3ae-8f7c00815459'
}

const perform = (z, bundle) => {
  const query =  `
      ${projectFragment}
      mutation zapierCreateProject($projectName: String!, $company: Boolean) {
        createProject(input: {name: $projectName, company: $company}) {
          ok
          project {
            ...projectData
          }
        }
      }
    `;

  const variables = _.pick(bundle.inputData, ["projectName", "company"]);

  return gqlRequest(z, bundle, query, variables).then(response => {
    const { data, errors } = JSON.parse(response.content);
    if (!data || !data.createProject || !data.createProject.ok){
      throw new Error(`Could not create project: ${errors[0].message}`)
    }
    const output = data.createProject.project;
    output.createdAt = new Date(output.createdAt);
    output.modifiedAt = new Date(output.modifiedAt);
    return output;
  });
};

module.exports = {
  key: "project",
  noun: "Project",

  display: {
    label: "Create Project",
    description: "Creates a project.",
    important: true,
  },

  operation: {
    sample,
    inputFields: [
      { key: "company", label: "Company project", type: 'boolean', required: false },
      { key: "projectName", label: "Project Name", required: true }
    ],
    perform,
    outputFields: [
      { key: 'id', label: 'ID', type: 'integer' },
      { key: 'uuid', label: 'UUID' },
      { key: 'name', label: 'Name' },
      { key: 'prototypeUrl', label: 'Prototype URL' },
      { key: 'isArchived', label: 'Is Archived', type: 'boolean' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
      { key: 'modifiedAt', label: 'Modified At', type: 'datetime' },
      { key: 'passwordProtected', label: 'Password protected', type: 'boolean' },
      { key: 'settings', children: [
        { key: 'deviceFrame', label: 'Device Frame' },
        { key: 'portrait', label: 'Portrait orientation', type: 'boolean' },
      ]},
    ]
  }
};
