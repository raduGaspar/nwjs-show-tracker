# Show Tracker
A simple interface for tracking tv shows built with NW and AngularJS

## Latest Release: v1.0
| Windows (x64) | Linux (x64) | Mac (x64) |
| ------------- | ----------- | --------- |
| [download](releases/download/v1.0/win64-v1.0.zip) | [download](releases/download/v1.0/linux64-v1.0.zip) | [download](releases/download/v1.0/osx64-v1.0.zip) |

# Running
Make sure you have NodeWebkit installed locally and added to your path
```sh
# !!! make sure nw and gulp are globally accessible !!!
# run this to install all dependencies (bower and npm) and prepare the app for packaging
# this will minify/uglify all files and create a 'dist' folder
sh dist.sh

# you can run the app form the base folder like so:
nw .

# or from the 'dist' folder like so:
nw dist
```

# Distribution and Packaging
`package.js` was writen for Windows and it will put the packaged app in your `c:/builds` folder; edit this to your liking;

The default targeted platforms are `win64`, `osx64` and `linux64`