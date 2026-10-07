const fs = require('fs');
const path = './Frontend/src/features/interview/style/home.scss';
let content = fs.readFileSync(path, 'utf8');

// Replace hex colors
content = content.replace(/#fa224d/gi, '#3b82f6');
content = content.replace(/#f43f5e/gi, '#60a5fa');
content = content.replace(/#e11d48/gi, '#2563eb');
content = content.replace(/#fb923c/gi, '#8b5cf6');
content = content.replace(/#be123c/gi, '#1d4ed8');
content = content.replace(/#fb7185/gi, '#93c5fd');

// Replace RGBA (250, 34, 77) with (59, 130, 246)
content = content.replace(/rgba\(250,\s*34,\s*77,/g, 'rgba(59, 130, 246,');

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced colors in home.scss');
