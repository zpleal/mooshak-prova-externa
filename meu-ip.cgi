#!/usr/local/bin/node


const answer = {
    ip: process.env['REMOTE_ADDR']
}

console.log('Content-type: text/json');
console.log('');
console.log(JSON.stringify(answer));
