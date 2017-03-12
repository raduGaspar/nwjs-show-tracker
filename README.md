# BrewLeg
A simple boilerplate for `babel-redux-eslint-webpack-less-enzyme-gulp`

## Download and install Node v6.7.0 (or newer)
https://nodejs.org/download/release/v6.7.0/

## Upgrade npm to version 3.10.7 (or newer)
on windows go to `C:\Program Files\nodejs` and run

```sh
npm install npm@3.10.7
```

## Check you have the proper version by running
```sh
node -v
npm -v
```

## Install the following globally (run terminal as admin)
```sh
npm install -g gulp
npm install -g webpack
```

## Test that the global dependencies are available by running
```sh
gulp -v
webpack
```

If the commands don't work, make sure that gulp and webpack are in the environment PATH variables.

## Install project dependencies by running
```sh
npm install
```

In the project root folder

## If you're using Webstorm, disable file auto-save to make it easier for webpack to detect file changes.
```sh
Settings > System Settings and uncheck
[ ] Save files on frame deactivation
[ ] Use "safe write"
```
## Commands
Running locally
```sh
npm run debug
```
Building for production
```sh
npm run build
```
Running Tests (automatically ran when building for production)
```sh
npm run test
```
Deploying to test environment (make sure you configure the `deploy-test` task in `gulpfile.js`)
```sh
npm run deploy-test
```