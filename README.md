# BBD Comtech - WebApp
# Technologies
[![My Skills](https://skillicons.dev/icons?i=angular,sass,gulp,css,html,php,bootstrap&perline=7)](https://skillicons.dev)

#### Front-end: AngularJS
#### Back-end: PHP

The backend of php and simple php backend and sends the fetch to its own URL

## About
It's an attendance manager application, where you can create daily attendance and signatures on the workspaces you create.
For each employee hired, you can generate an excel spreadsheet for each month showing their signatures and dates

## Quick Setup

1. Download and install Node.js , which we use to manage our dependencies. If Node.js is already installed in your machine and jump to step 2.
2. Run npm install --global gulp-cli command. If you already installed Gulp CLI previously, you can skip this step and jump to step 3.
3. Navigate to the root directory and run npm install or to install our local dependencies listed in package.json.
4. Run gulp command.

## Gulp Toolkit includes the following simple Gulp commands:

1. gulp
2. gulp dist
3. gulp build


#### gulp: 
gulp is the main command to start compiling and watching SASS / HTML files. When you run gulp it starts a server poping up a new tab in your default browser. Any changes from the source files are instantly compiled on the fly and updates browser tab instantly with the help of Live Reload (Browsersync).

#### gulp dist:
gulp dist command compiles and copies all files from ./src/* folder into ./dist/* folder and prepares production files. Basically, it copies whole complied assets into ./dist/* folder with minified theme css/js files.

#### gulp build:
gulp build command prepares performance ready fully production files of your project into ./build/* folder by automatically detecting all used asset sources from HTML pages.
