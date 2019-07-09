
const should = require('should');
const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('createScreen', () => {
    it('should be able to add a screen to a project', (done) => {
        const bundle = {
            authData: {
                access_token: process.env.ACCESS_TOKEN,
            },
            inputData: {
                screenName: Math.random().toString(36).substring(7),
                projectPk: 3842846,
                imageURL: 'https://marvel-live.freetls.fastly.net/serve/2019/3/7228822f4c8742caadf9f1547368142a.png',
            }
        };
        appTester(App.creates.screen.operation.perform, bundle)
            .then(results => {
                console.log(results)
                done();
            })
            .catch(done);
    }).timeout(50000);

});
