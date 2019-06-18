const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('My App', () => {

    it('should be able to create a comment', (done) => {

        const bundle = {
            authData: {
                access_token: process.env.ACCESS_TOKEN,
            },
            inputData: {
                screenPk: 54411789,
                message: 'This is an example of a nice comment!'
            }
        };
        appTester(App.creates.addCommentToScreen.operation.perform, bundle)
            .then(results => {
                console.log(results)
                // should(results.length).above(1);
                // const firstResult = results[0];
                // console.log('test result: ', firstResult)
                // should(firstResult.name).eql('name 1');
                // should(firstResult.directions).eql('directions 1');

                done();
            })
            .catch(done);
    }).timeout(50000);

});
