/**
 * build-submission.js - Cross-platform submission builder
 * 
 * Works on Windows, Mac, and Linux
 * Automatically detects GitHub repo info from git remotes
 * 
 * Run: npm run submit
 * 
 * @author Tony
 * @version 1.0.0
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============== STUDENT: UPDATE THESE VALUES ==============
const STUDENT_NAME = 'Tony';
const RENDER_URL = 'https://backend-7lgl.onrender.com';
// ==========================================================

const ROOT = path.resolve(__dirname, '../..');
const FRONTEND_DIR = path.join(ROOT, 'frontend');
const BACKEND_DIR = path.join(ROOT, 'backend');
const SUBMISSION_DIR = path.join(ROOT, 'submission');
const ZIP_FILE = path.join(ROOT, `${STUDENT_NAME}-coursework.zip`);

// Get GitHub info from git remotes
function getGitRemote(dir) {
  try {
    const url = execSync('git remote get-url origin', { cwd: dir, encoding: 'utf-8' }).trim();
    // Parse: https://github.com/user/repo.git or git@github.com:user/repo.git
    const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

const FRONTEND_REPO = getGitRemote(FRONTEND_DIR);
const BACKEND_REPO = getGitRemote(BACKEND_DIR);
const GITHUB_USERNAME = FRONTEND_REPO.split('/')[0] || 'YOUR_USERNAME';
const FRONTEND_REPO_NAME = FRONTEND_REPO.split('/')[1] || 'frontend';

console.log('🔍 Detected GitHub username:', GITHUB_USERNAME);
console.log('🔍 Frontend repo:', FRONTEND_REPO);
console.log('🔍 Backend repo:', BACKEND_REPO);

// Helper: recursively copy directory
function copyDir(src, dest, exclude = []) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  
  for (const item of fs.readdirSync(src)) {
    if (exclude.includes(item)) continue;
    
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper: remove directory recursively
function rmDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Clean previous artifacts
console.log('🧹 Cleaning previous submission...');
rmDir(SUBMISSION_DIR);
if (fs.existsSync(ZIP_FILE)) fs.unlinkSync(ZIP_FILE);

// Create directory structure
console.log('📁 Creating submission structure...');
fs.mkdirSync(path.join(SUBMISSION_DIR, 'vue-frontend'), { recursive: true });
fs.mkdirSync(path.join(SUBMISSION_DIR, 'express-backend'), { recursive: true });
fs.mkdirSync(path.join(SUBMISSION_DIR, 'exports'), { recursive: true });
fs.mkdirSync(path.join(SUBMISSION_DIR, 'postman'), { recursive: true });

// Copy frontend (exclude node_modules, dist, .git)
console.log('📦 Copying Vue frontend...');
copyDir(FRONTEND_DIR, path.join(SUBMISSION_DIR, 'vue-frontend'), ['node_modules', 'dist', '.git', 'scripts']);

// Copy backend (exclude node_modules, .git, .env)
console.log('📦 Copying Express backend...');
copyDir(BACKEND_DIR, path.join(SUBMISSION_DIR, 'express-backend'), ['node_modules', '.git']);
// Remove .env (contains secrets)
const envPath = path.join(SUBMISSION_DIR, 'express-backend', '.env');
if (fs.existsSync(envPath)) fs.unlinkSync(envPath);

// Copy exports
console.log('📦 Copying MongoDB exports...');
const exportsDir = path.join(BACKEND_DIR, 'exports');
const seedFile = path.join(BACKEND_DIR, 'data', 'lessons-seed.json');

if (fs.existsSync(path.join(exportsDir, 'lessons.json'))) {
  fs.copyFileSync(path.join(exportsDir, 'lessons.json'), path.join(SUBMISSION_DIR, 'exports', 'lessons.json'));
} else if (fs.existsSync(seedFile)) {
  fs.copyFileSync(seedFile, path.join(SUBMISSION_DIR, 'exports', 'lessons.json'));
  console.log('   ⚠️  Using seed data (export from MongoDB Compass for live data)');
}

if (fs.existsSync(path.join(exportsDir, 'orders.json'))) {
  fs.copyFileSync(path.join(exportsDir, 'orders.json'), path.join(SUBMISSION_DIR, 'exports', 'orders.json'));
} else {
  fs.writeFileSync(path.join(SUBMISSION_DIR, 'exports', 'orders.json'), '[]');
  console.log('   ⚠️  Created empty orders.json (export from MongoDB Compass after testing)');
}

// Copy Postman collection
const postmanFile = path.join(BACKEND_DIR, 'postman_collection.json');
if (fs.existsSync(postmanFile)) {
  fs.copyFileSync(postmanFile, path.join(SUBMISSION_DIR, 'postman', 'CST3144_API_Test.postman_collection.json'));
} else {
  console.log('   ⚠️  No postman_collection.json found in backend folder');
}

// Create README
console.log('📝 Creating README...');
const readme = `# LearnHub - CST3144 Coursework Submission

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Frontend Repository** | https://github.com/${FRONTEND_REPO} |
| **Frontend Live (GitHub Pages)** | https://${GITHUB_USERNAME}.github.io/${FRONTEND_REPO_NAME}/ |
| **Backend Repository** | https://github.com/${BACKEND_REPO} |
| **Backend Live (Render)** | ${RENDER_URL}/lessons |

## 📁 Contents

\`\`\`
submission/
├── vue-frontend/       # Vue 3 + Vite frontend source code
├── express-backend/    # Express.js + MongoDB backend source code
├── exports/
│   ├── lessons.json    # MongoDB lessons collection export
│   └── orders.json     # MongoDB orders collection export
└── postman/
    └── CST3144_API_Test.postman_collection.json
\`\`\`

## 🚀 Quick Start

### Backend
\`\`\`bash
cd express-backend
npm install
# Create .env with MONGODB_URI and DB_NAME
npm run seed   # Seed the database
npm start      # Start server on port 3000
\`\`\`

### Frontend
\`\`\`bash
cd vue-frontend
npm install
npm run dev    # Start dev server
npm run build  # Build for production
\`\`\`

## 📋 API Endpoints

- \`GET /lessons\` - Get all lessons
- \`GET /lessons/:id\` - Get single lesson by ID
- \`PUT /lessons/:id\` - Update lesson (e.g., reduce spaces)
- \`POST /orders\` - Create a new order
- \`GET /search?q=\` - Search lessons
- \`GET /images/:filename\` - Serve lesson images

## ✅ Features

- [x] Display lessons with sorting (subject, location, price, spaces)
- [x] Add to cart with real-time space updates
- [x] Cart management (add/remove items)
- [x] Checkout with name/phone validation
- [x] Order creation with database updates
- [x] Search functionality
- [x] Request logging middleware
`;

fs.writeFileSync(path.join(SUBMISSION_DIR, 'README.md'), readme);

// Create zip
console.log('📦 Creating zip file...');
try {
  // Try using PowerShell on Windows, zip on Unix
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    execSync(`powershell Compress-Archive -Path "${SUBMISSION_DIR}\\*" -DestinationPath "${ZIP_FILE}" -Force`, { stdio: 'inherit' });
  } else {
    execSync(`cd "${SUBMISSION_DIR}" && zip -r "${ZIP_FILE}" .`, { stdio: 'inherit' });
  }
} catch (err) {
  console.log('⚠️  Could not create zip automatically. Please zip the submission folder manually.');
}

// Report
const stats = fs.existsSync(ZIP_FILE) ? fs.statSync(ZIP_FILE) : null;
console.log('');
console.log('============================================');
if (stats) {
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`✅ Created: ${STUDENT_NAME}-coursework.zip`);
  console.log(`📊 Size: ${sizeMB} MB (must be ≤ 10MB)`);
  if (stats.size > 10 * 1024 * 1024) {
    console.log('⚠️  WARNING: File exceeds 10MB!');
  }
} else {
  console.log(`✅ Submission folder ready at: submission/`);
  console.log('📦 Please zip it manually');
}
console.log('============================================');
