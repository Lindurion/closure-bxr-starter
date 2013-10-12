closure-bxr-starter
===================

Starter [node.js](http://nodejs.org) project using [Closure Tools](http://developers.google.com/closure), [Bootstrap](http://getbootstrap.com), [Express](http://expressjs.com), and [RECESS](http://twitter.github.io/recess). Please feel free to [fork](http://help.github.com/articles/fork-a-repo) or [duplicate it](http://help.github.com/articles/duplicating-a-repository) to start your own project.

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
Build debug version (human-readable):

    $ node build.js --debug

Build release version (fully minified):

    $ node build.js

Customize input files and output directories for the project by editing `project-config.js`.


License & Copyright
-------------------
This package is released under the Apache License, Version 2.0. See LICENSE file for details.

License information for 3rd party tools used can be found under the `3p/` folder. License information for other npm packages used can be found in the information and/or source code for those packages listed on the [npm website](http://npmjs.org/).

Copyright &copy; 2013 Eric W. Barndollar.
