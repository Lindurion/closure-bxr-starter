closure-bxr-starter
===================

Starter [node.js](http://nodejs.org) project using [Closure Tools](http://developers.google.com/closure), [Bootstrap](http://getbootstrap.com), [Express](http://expressjs.com), and [RECESS](http://twitter.github.io/recess). Designed for you to [fork](http://help.github.com/articles/fork-a-repo) or [duplicate](http://help.github.com/articles/duplicating-a-repository) it to start your own project.

- **Closure Tools**: [JS compiler](https://developers.google.com/closure/compiler), [Soy templates](http://developers.google.com/closure/templates) for HTML (via [closure-pro-build](http://github.com/Lindurion/closure-pro-build) package)
- **Bootstrap 3**: Mobile-first responsive layout CSS framework
- **Express 3**: Node.js HTTP server & web application framework
- **RECESS**: CSS & [LESS](http://lesscss.org) compiler supporting color constants, functions, mixins, etc.

Also includes [jQuery 2](http://jquery.com) as part of Bootstrap support.


Status
------
NOT ready for use yet. Implementation in progres...


Usage
-----
(First time only) Install node.js package dependencies:

    $ npm install

Run lint checks for good code conventions & style (edit `lint.js` to customize checks):

    $ node lint.js

Build your JS and CSS (include `--debug` for human-readable output):

    $ node build.js [--debug]

Run server:

    $ node server.js [--debug] [--port=8080]

Then view in a web browser at [http://localhost:8080/](http://localhost:8080/).

You can either rerun `build.js` manually after making edits, or you can run a script to watch for changes to files under `src/` and automatically rebuild the project when any file is changed:

    $ node watch.js [--debug]

Customize input files and output directories for the project by editing `project-config.js`.


### System Requirements ###

Java and Python version 2 must be installed and part of the system path as `java` and `python` in order to run all Closure tools. These commands are also configurable; see [closure-pro-build documentation](http://github.com/Lindurion/closure-pro-build#system-requirements) for more details.


License & Copyright
-------------------
This package is released under the Apache License, Version 2.0. See LICENSE file for details.

License information for 3rd party tools used can be found under the `3p/` folder. License information for other npm packages used can be found in the information and/or source code for those packages listed on the [npm website](http://npmjs.org/).

Copyright &copy; 2013 Eric W. Barndollar.
