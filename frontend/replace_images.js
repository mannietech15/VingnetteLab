const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('@/app/workspaces/')) {
        content = content.replace(/@\/app\/workspaces\//g, '@/assets/');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
