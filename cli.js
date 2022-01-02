#!/usr/bin/env node


const [,, ...args ] = process.argv;

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const lines = [];
rl.on('line', (line) => lines.push( line ));
rl.on('close',  () => {
    const input = lines.join();
    // const data = JSON.parse(input);

    console.log({args});
    console.log({input});
});

