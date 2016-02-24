#!/bin/sh
set -e #any subsequest commands which fail will cause the sell script to exit immediately
clear
echo 'removing dist folder'
rm -rf dist
echo 'installing bower dependencies'
bower update
echo 'installing npm dependencies'
npm install
echo 'compiling all scss files to css'
gulp compass
echo 'running distribution tasks'
gulp
echo 'distribution all done'
echo 'packaging app'
node package.js
echo 'all done!'