const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('createComment', () => {
    it('should be able to create a comment', (done) => {
        const bundle = {
            authData: {
                access_token: process.env.ACCESS_TOKEN,
            },
            inputData: {
                screenPk: 59033130,
                message: 'This is an example of a nice comment!'
            }
        };
        appTester(App.creates.addCommentToScreen.operation.perform, bundle)
            .then(results => {
                console.log(results);
                done();
            })
            .catch(done);
    }).timeout(50000);
});
