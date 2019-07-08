const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('addCollaborators', () => {
    it('should be able to add a collaborator', (done) => {
        const bundle = {
            authData: {
                access_token: process.env.ACCESS_TOKEN,
            },
            inputData: {
                projectPk: 3912844,
                collaborators: 'joe.alcorn@marvelapp.com',
            }
        };
        appTester(App.creates.addCollaboratorsToProject.operation.perform, bundle)
            .then(results => {
                console.log(results)
                done();
            })
            .catch(done);
    }).timeout(50000);
});
