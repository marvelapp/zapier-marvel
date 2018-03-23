const sample = require('../samples/sample_issue');

const createProject = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://marvelapp.com/graphql',
    body: {
      query: `
        mutation {
          createProject(name: "${bundle.inputData.name}") {
            ok
            project {
              pk
              name
              prototypeUrl
            }
          }
        }
      `
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'project',
  noun: 'Project',

  display: {
    label: 'Create Project',
    description: 'Creates a project.'
  },

  operation: {
    inputFields: [
      {key: 'name', label:'Name', required: true}
    ],
    perform: createProject,
    sample: sample
  }
};
