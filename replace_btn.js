const fs = require('fs');
const path = './Frontend/src/style/button.scss';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/background-color\s*:\s*#fa224d\s*;/g, 'background-color : var(--primary) ;');

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced hardcoded color in button.scss');
