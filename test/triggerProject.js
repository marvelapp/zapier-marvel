const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('triggerProject', () => {
    it('should fetch latest projects', (done) => {
        const bundle = {
            authData: {
                access_token: process.env.ACCESS_TOKEN,
            }
        };
        appTester(App.triggers.project.operation.perform, bundle)
            .then(results => {
                console.log(results)
                should(results.length).above(1);
                done();
            })
            .catch(done);
    }).timeout(50000);
});
