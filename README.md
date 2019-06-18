# Development

This is a zapier cli app. You can install everything you need with npm.

To get yourself started you need to register a zapier app, which you can do with [`./node_modules/zapier-platform-cli/zapier.js register "marvel dev"`](https://zapier.github.io/zapier-platform-cli/cli.html#register). This will register an app and generate a `.zapierapprc` file. The production file is in this directory as `.zapierapprc.prod`. You'll need to swap them when you're pushing a production version to zapier.

With your `.zapierapprc` in place, you can [push](https://zapier.github.io/zapier-platform-cli/cli.html#register) to zapier for testing. 
