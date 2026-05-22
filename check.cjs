const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf-8');
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('import')) {
        console.log('Line ' + (i + 1) + ':', lines[i].substring(0, 100));
    }
}
