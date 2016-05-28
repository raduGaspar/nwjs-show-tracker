# Show Tracker
A simple interface for tracking tv shows built with NW and AngularJS

Download a packaged copy from the releases section!

```sh
# if you encounter problems running the release on linux
# open a terminal
# navigate to application folder and run
chmod u+x show-tracker .
./show-tracker
```

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

### Suggestions list
* [x] increase season number by using right click instead of ALT key
* [x] show version number in app title bar
* [x] add filter area to tabs
* [x] show selected tracker name on search button hover
* [x] change current filter area to add show (remove add show button)
* [ ] store which tab is currently selected (per session or maybe in db)
* [ ] keep imdb information in db, maybe add a show link to imdb (before show name?)
* [ ] package app with app-name-osVersion-versionNumber
* [ ] replace episodes list with season list
* [ ] add a season details view (like imdb) with inversed history (latest appears first)