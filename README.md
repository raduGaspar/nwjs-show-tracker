# Show Tracker based on [BrewLeg](https://github.com/raduGaspar/brewleg)
A simple interface for tracking tv shows built with NW and React

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

Download a packaged copy from the releases section!

```sh
# if you encounter problems running the release on linux
# open a terminal
# navigate to application folder and run
chmod u+x show-tracker .
./show-tracker
```

## Commands
Running locally (Make sure you have NodeWebkit installed globally and added to your path)
```sh
npm run debug

# run the app
nw .
```
Building for production
```sh
npm run build
```
Running Tests (automatically ran when building for production)
```sh
npm run test
```

# Distribution and Packaging
`package.js` was writen for Windows and it will put the packaged app in your `c:/builds` folder; edit this to your liking;

The default targeted platforms are `win64`, `osx64` and `linux64`

