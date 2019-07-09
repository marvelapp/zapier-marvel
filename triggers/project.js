const _ = require("lodash");
const { gqlRequest } = require('../api');


const sample = require('../samples/sample_project');
const projectFragment = require('../fragments/project');

const query = `
${ projectFragment }
query zapierGetProjects($first: Int!, $personalCursor: String, $skipPersonal: Boolean!, $companyCursor: String, $skipCompany: Boolean!) {
  user {
    company @skip(if: $skipCompany) {
      projects(first: $first, after: $companyCursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...projectData
          }
        }
      }
    }
    projects(first: $first, after: $personalCursor) @skip(if: $skipPersonal) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...projectData
        }
      }
    }
  }
}
`

const fetchProjects = (z, bundle, personalCursor, skipPersonal, companyCursor, skipCompany) => {
  z.console.log('Fetching projects', {
    type: 'personal',
    cursor: personalCursor,
    skip: skipPersonal,
  }, {
    type: 'company',
    cursor: companyCursor,
    skip: skipCompany,
  })
  return gqlRequest(z, bundle, query, {
    first: 25,
    personalCursor: personalCursor,
    companyCursor: companyCursor,
    skipPersonal: skipPersonal || false,
    skipCompany: skipCompany || false,

  });
}

const getProjectsFromEdges = (edges) => {
  const dateCutoff = new Date() - 60 * 60 * 24 * 1000;
  return edges.map((edge) => {
    return edge.node;
  }).filter((node) => {
    return new Date(node.createdAt) > dateCutoff;
  });
}

const dedupeProjects = (personalProjects, companyProjects) => {
  // deduplicate the projects we found
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
}

const triggerProject = async (z, bundle) => {
  let personalCursor, companyCursor;
  let skipPersonal = false, skipCompany = false;
  let personalProjects = [], companyProjects = [];
  let response, respData;

  const maxPages = 5;
  for (var i = 0; i <= maxPages; i++) {
    response = await fetchProjects(z, bundle, personalCursor, skipPersonal, companyCursor, skipCompany);
    respData = z.JSON.parse(response.content);

    // if we've hit the end, skip the field for the next request
    skipPersonal = _.get(respData, 'data.user.projects.pageInfo.hasNextPage', false) == false;
    skipCompany = _.get(respData, 'data.user.company.projects.pageInfo.hasNextPage', false) == false;

    // update our cursors so we can grab the next pages in the next request
    if (!skipPersonal) {
      personalCursor = _.get(respData, 'data.user.projects.pageInfo.endCursor');
    }

    if (!skipCompany) {
      companyCursor = _.get(respData, 'data.user.company.projects.pageInfo.endCursor');
    }

    const personalEdges = _.get(respData, 'data.user.projects.edges', []);
    const companyEdges = _.get(respData, 'data.user.company.projects.edges', []);

    personalProjects = personalProjects.concat(getProjectsFromEdges(personalEdges));
    companyProjects = companyProjects.concat(getProjectsFromEdges(companyEdges));

    if (!personalProjects.length) skipPersonal = true;
    if (!companyProjects.length) skipCompany = true;

    if (skipCompany && skipPersonal) {
      break;
    }
  }
  return dedupeProjects(personalProjects, companyProjects);
};

module.exports = {
  key: 'project',
  noun: 'Project',

  display: {
    label: 'Fetch Projects',
    description: 'Triggers when a new project appears in your account',
    important: true,
  },

  operation: {
    inputFields: [],
    outputFields: [
      { key: 'id', label: 'ID', type: 'integer' },
      { key: 'uuid', label: 'UUID' },
      { key: 'name', label: 'Name' },
      { key: 'prototypeUrl', label: 'Prototype URL' },
      { key: 'isArchived', label: 'Is Archived', type: 'boolean' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
      { key: 'modifiedAt', label: 'Modified At', type: 'datetime' },
      { key: 'passwordProtected', label: 'Password protected', type: 'boolean' },
      {
        key: 'settings', children: [
          { key: 'deviceFrame', label: 'Device Frame' },
          { key: 'portrait', label: 'Portrait orientation', type: 'boolean' },
        ]
      },
    ],
    perform: triggerProject,

    sample: sample,
  }
};
