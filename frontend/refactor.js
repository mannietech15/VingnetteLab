const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Link
  if (content.includes("import Link from 'next/link';")) {
    content = content.replace(/import Link from 'next\/link';/g, "import { Link } from 'react-router-dom';");
    changed = true;
  }

  // 2. Image
  if (content.includes("import Image from 'next/image';")) {
    content = content.replace(/import Image from 'next\/image';/g, "const Image = ({ src, alt, width, height, className, fill, ...props }: any) => <img src={src} alt={alt} width={width} height={height} className={className} style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}} {...props} />;");
    changed = true;
  }

  // 3. Navigation hooks
  if (content.includes('next/navigation')) {
    // Replace imports
    if (content.includes('useRouter') && content.includes('useSearchParams')) {
      content = content.replace(/import\s+{\s*useRouter,\s*useSearchParams\s*}\s+from\s+'next\/navigation';/, "import { useNavigate, useSearchParams } from 'react-router-dom';");
    } else if (content.includes('useRouter')) {
      content = content.replace(/import\s+{\s*useRouter\s*}\s+from\s+'next\/navigation';/, "import { useNavigate } from 'react-router-dom';");
    } else if (content.includes('usePathname')) {
      content = content.replace(/import\s+{\s*usePathname\s*}\s+from\s+'next\/navigation';/, "import { useLocation } from 'react-router-dom';");
    } else if (content.includes('useSearchParams')) {
      content = content.replace(/import\s+{\s*useSearchParams\s*}\s+from\s+'next\/navigation';/, "import { useSearchParams } from 'react-router-dom';");
    }

    // Replace usage
    content = content.replace(/const router = useRouter\(\);/g, "const navigate = useNavigate();");
    content = content.replace(/router\.push\(/g, "navigate(");
    content = content.replace(/const pathname = usePathname\(\);/g, "const location = useLocation();\n  const pathname = location.pathname;");
    changed = true;
  }

  // 4. next/dynamic
  if (content.includes("import dynamic from 'next/dynamic';")) {
    content = content.replace(/import dynamic from 'next\/dynamic';/g, "import { lazy, Suspense } from 'react';");
    // Replace dynamic(() => import(...), { ssr: false })
    content = content.replace(/const (\w+) = dynamic\(\(\) => import\('([^']+)'\),\s*{\s*ssr:\s*false\s*}\)/g, "const $1 = lazy(() => import('$2'))");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src'));
