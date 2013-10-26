#!/usr/bin/env node

// Copyright 2013 Eric W. Barndollar.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var commander = require('commander');
var express = require('express');


//==============================================================================
// Command-Line Options
//==============================================================================

commander
    .option('-p, --port <port>', 'Port to run HTTP server on', Number, 8080)
    .parse(process.argv);


//==============================================================================
// Configure & Run HTTP Server
//==============================================================================

var app = express();

app.get('/', function(req, res) {
  res.send('Hello, world!');
});

app.listen(commander.port);
