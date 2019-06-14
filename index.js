// const repoTrigger = require('./triggers/repo');
const createProject = require('./creates/createProject');
const addCollaboratorsToProject = require("./creates/addCollaboratorsToProject");
const addCommentToScreen = require("./creates/addCommentToScreen");
const createScreen = require("./creates/createScreen");
const triggerProject = require('./triggers/project');
const authentication = require('./authentication');

const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }
  return response;
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,


  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [],
  afterResponse: [handleHTTPError],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {},

  // If you want your trigger to show up, you better include it here!
  triggers: {
    // [repoTrigger.key]: repoTrigger,
    [triggerProject.key]: triggerProject,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [createProject.key]: createProject,
    [addCollaboratorsToProject.key]: addCollaboratorsToProject,
    [addCommentToScreen.key]: addCommentToScreen,
    [createScreen.key]: createScreen,
  }
};

// Finally, export the app.
module.exports = App;
