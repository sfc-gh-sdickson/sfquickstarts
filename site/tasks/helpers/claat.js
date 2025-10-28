'use strict';

const childprocess = require('child_process');
const spawn = childprocess.spawn;

// claat is a wrapper around the claat tool.
//
//   cwd - codelabs content dir
//   cmd - claat command, either 'update' or 'export'
//   fmt - output format, e.g. 'html'
//   ga - google analytics tracking code
//   args - an array of source doc IDs or codelab names (IDs)
//   callback - an async task callback function
//   prefix - prefix for codelab-elements
//
exports.run = (cwd, cmd, env, fmt, ga, o, prefix, args, callback) => {
  const runClaats = (i) => {
    if (i >= args.length) {
      callback();
      return;
    }
    const currentFile = args[i];
    console.log(`[claat.js] Processing file ${i + 1}/${args.length}: ${currentFile} in directory ${cwd}`);
    const claatArgs = [cmd, '-e', env, '-f', fmt, '-ga', ga, '-o', o, '-prefix', prefix, currentFile];
    const proc = spawn('claat', claatArgs, { stdio: 'inherit', cwd: cwd, env: process.env, shell: false });
    proc.on('close', (e) => {
      if (e) {
        throw new Error(e);
      }
      runClaats(i + 1);
    });
  };
  runClaats(0);
};
