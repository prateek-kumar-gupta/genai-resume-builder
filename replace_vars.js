const fs = require('fs');
const path = './Frontend/src/style.scss';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/--primary: #fa224d;/g, '--primary: #3b82f6;');
content = content.replace(/--primary-hover: #e11d48;/g, '--primary-hover: #2563eb;');
content = content.replace(/--primary-glow: rgba\(250,\s*34,\s*77,\s*0\.35\);/g, '--primary-glow: rgba(59, 130, 246, 0.35);');
content = content.replace(/--primary-gradient: linear-gradient\(135deg, #fa224d 0%, #be123c 100%\);/g, '--primary-gradient: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);');
content = content.replace(/--border-focus: rgba\(250,\s*34,\s*77,\s*0\.5\);/g, '--border-focus: rgba(59, 130, 246, 0.5);');

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced global CSS variables in style.scss');
