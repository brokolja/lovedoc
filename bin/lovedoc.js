#!/usr/bin/env node

var fs = require('fs');
var hoxy = require('hoxy');
var _ = require('lodash');

var cwd = process.cwd();

var remoteurl = '';
var localport = '';
var proxy;
var jsonPath = cwd;
var directory = '';

function requireUncached(module){
  delete require.cache[require.resolve(module)]
  return require(module)
}

if (!process.argv[2] || !process.argv[3]) {
  if (!process.argv[2] && !process.argv[3]) {
    return console.log('Missing arguments: remoteurl localport');
  } else if (!process.argv[2]) {
    return console.log('Missing arguments: remoteurl');
  } else if (!process.argv[3]) {
    return console.log('Missing arguments: localport');
  }
}

if (process.argv[4]) {
  if (fs.existsSync(cwd + '/' + process.argv[4])) {
    directory = process.argv[4];
    jsonPath = cwd + '/' + process.argv[4];
  } else {
    return console.log('Dir: ' + cwd + '/' + process.argv[4] +' does not exist!')
  }
}

if (!fs.existsSync(jsonPath + '/lovedoc.json')) {
  return console.log('File: ' + jsonPath + '/lovedoc.json' +' does not exist!')
}

remoteurl = process.argv[2];
localport = process.argv[3];

proxy = hoxy.createServer({
  reverse: remoteurl
}).listen(localport);


console.log('Hey doc, patient: '+ remoteurl + ' has an op at: localhost:' + localport + '.')

proxy.intercept({
  phase: 'request',
}, function (req, resp, cycle) {
  if (fs.existsSync(cwd + (directory !== '' ? '/' + directory : '') + req.url)){
    return cycle.serve({
      path: cwd + (directory !== '' ? '/' + directory : '') + req.url,
      strategy: 'overlay'
    });
  }
});

proxy.intercept({
  phase: 'response',
  mimeType: 'text/html',
  as: '$'
}, function (req, resp, cycle) {
  var lovedoc;
  try {
    lovedoc = requireUncached(jsonPath + '/lovedoc.json');
  } catch (err) {
    console.log('lovedoc.json invalid json!', err)
  }    
  _.each(lovedoc, function (actions, selector) {
    _.each(actions, function (action, file) {
      var action = action.replace(/\s/g, ""); // Hint: You can use whitespace in lovedoc.json to use same values multiple times
      var file = file.replace(/\s/g, ""); // Hint: You can use whitespace in lovedoc.json to use same values multiple times
      var tag = '';
      var fileContent = '';
      var htmlContent = '';

      if (file.indexOf('.css') >= 0) {
        tag = 'style';
      } else if (file.indexOf('.js') >= 0) {
        tag = 'script';
      } else {
        tag = 'html';
      }
      try {
        if (!fs.existsSync(jsonPath + '/' + file)) {
          return console.log('Local file: '+ jsonPath + '/' + file + ' does not exist!');
        }
        if (tag === 'style') {
          htmlContent = '<link rel="stylesheet" type="text/css" href="/'+ (directory !== '' ? directory + '/' : '') + file +'">'
        } else if (tag === 'script') {
          htmlContent = '<script type="text/javascript" src="/'+ (directory !== '' ? directory + '/' : '') + file +'"></script>';
        } else if (tag === 'html') {
          fileContent = fs.readFileSync(jsonPath + '/' + file).toString();
          htmlContent = fileContent;
        }
        resp.$(selector)[action](htmlContent);
      } catch (err) {
        if (err.code === 'ENOENT') {
          return console.log('Local file: '+ jsonPath + '/' + file + ' does not exist!');
        } else {
          return console.log('Not possible: ' + selector + ' | ' + action + ' | ' + jsonPath + '/' + file);
        }
      }  
    });
  });
});
