# TodoMVC example with tartJS.

Join us on [![tartJS Slack](http://slack.tartjs.org/badge.svg)](http://slack.tartjs.org) for anything about tartJS.

This project aims to display the best practices of tartJS development in a single page web application. For a demo of hybrid mobile app development, take a look at the [`https://github.com/tart/tartjs-mobile-demo`](https://github.com/tart/tartjs-mobile-demo)
repository.

## Install

```
$ git clone --recursive git@github.com:tart/tartjs-todomvc.git
$ cd tartjs-todomvc
$ npm install
```

Make sure you have gulp installed:
```
$ sudo npm install -g gulp
```

Now you are ready to run the project. After you execute this command, the project will start automatically on your browser.
```
$ gulp
```

## Development

This project provides a development web server that listens on port 8000.

Run the default task via `gulp` and the project will be ready for development and inspection. Source files are symlinked, and the server watches for file changes with live reloading, so any change you make to the files under `src` folder will cause an automatic reload.

## Production builds

When you are satisfied with development and want to make a production build in order to deploy the app, just run the `bundle` task via `gulp bundle`. This compiles your source code with Closure Compiler in advanced mode and concats and minifies your CSS files producing one file for all your JavaScript codes and one CSS file for all your styles. This task then suffixes these files to evade browser caches. Finally, it minifies the output HTML.

The live-reloading watch server can also be activated for these kind of builds via `gulp serve`.

Happy coding!

### App specs
This project follows the TodoMVC spec, which is available at https://github.com/tastejs/todomvc/blob/master/app-spec.md
