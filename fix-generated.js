import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatedDir = path.join(__dirname, 'src/generated/prisma');

const EXTENSIONS = ['.js', '.mjs', '.cjs', '.json', '.ts'];

function fixImports(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixImports(fullPath);
    } else if (entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(
        /(import|export)\s+((?:\*\s+as\s+\w+\s+)?from\s+)"((?:\.\.?\/[^"]+))"/g,
        (match, type, rest, importPath) => {
          if (EXTENSIONS.some(ext => importPath.endsWith(ext))) {
            return match;
          }
          const resolvedPath = path.join(dir, importPath);
          if (fs.existsSync(`${resolvedPath}.ts`) || fs.existsSync(`${resolvedPath}.js`)) {
            return `${type} ${rest}"${importPath}.js"`;
          }
          const indexTs = path.join(resolvedPath, 'index.ts');
          const indexJs = path.join(resolvedPath, 'index.js');
          if (fs.existsSync(indexTs) || fs.existsSync(indexJs)) {
            return `${type} ${rest}"${importPath}/index.js"`;
          }
          return match;
        }
      );
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

fixImports(generatedDir);
