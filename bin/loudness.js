#!/usr/bin/env node

const loudness = require('../lib/index');

const exec = (methodName, value) => loudness[methodName](value)
  .then(result => console.log(result))
  .catch(error => console.error(error));

switch(process.argv[2]) {
  case 'get':
    return exec('get');
  case 'set':
    return exec('set', process.argv[3]);
  case 'is-muted':
    return exec('isMuted');
  case 'mute':
    return exec('mute');
  case 'unmute':
    return exec('unmute');
  default:
    return console.error('Please input a valid sub command');
}
