const sample = require('../samples/sample_project');

const triggerProject = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: `https://api.marvelapp.com/graphql`,
    body: {
      query: `
        fragment projectData on ProjectNode {
          id: pk
          uuid
          name
          prototypeUrl
          isArchived
          createdAt
          modifiedAt
          settings {
            deviceFrame
            portrait
          }
        }

        query zapierGetProjects($first: Int!) {
          user {
            company {
              projects(first: $first) {
                edges {
                  node {
                    ...projectData
                  }
                }

              }
            }
            projects(first: $first) {
              edges {
                node {
                  ...projectData
                }
              }
            }
          }
        }
      `,
      variables: {
        first: 25,
      }
    }
  });
  return responsePromise
    .then(response => {
      const resp = JSON.parse(response.content);
      let companyProjects = [];

      const personalProjects = resp.data.user.projects.edges.map((edge) => {
        return edge.node;
      });

      if (resp.data.user.company) {
        companyProjects = resp.data.user.company.projects.edges.map((edge) => {
          return edge.node;
        });
      }

      const seen = {};
      let dedupedProjects = [];
      [...personalProjects, ...companyProjects].forEach((project) => {
        if (seen[project.id] === true) {
          return;
        }
        dedupedProjects.push(project);
        seen[project.id] = true;
      });

      dedupedProjects.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })

      return dedupedProjects;
    });
};

module.exports = {
  key: 'project',
  noun: 'Project',

  display: {
    label: 'Fetch Projects',
    description: 'Triggers when a new project appears in your account'
  },

  operation: {
    inputFields: [],
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'uuid', label: 'UUID' },
      { key: 'name', label: 'Name' },
      { key: 'prototypeUrl', label: 'Prototype URL' },
      { key: 'isArchived', label: 'Is Archived' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'modifiedAt', label: 'Modified At' },
    ],
    perform: triggerProject,

    sample: sample,
  }
};
