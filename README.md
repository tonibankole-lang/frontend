# LearnHub Frontend

Vue 3 + Vite frontend for the LearnHub lesson booking system.

## 🔗 Links

- **Live App**: `https://YOUR_USERNAME.github.io/vue-frontend/`
- **Backend API**: `https://YOUR_RENDER_URL.onrender.com`
- **Backend Repo**: [express-backend](https://github.com/YOUR_USERNAME/express-backend)

## 🛠 Tech Stack

- **Framework**: Vue 3 (Composition API compatible)
- **Build Tool**: Vite
- **Icons**: Font Awesome 6
- **Styling**: Custom CSS
- **Hosting**: GitHub Pages

## ✨ Features

- 📚 Browse available lessons with images and icons
- 🔍 Search lessons by subject, location, price, or spaces
- 🔄 Sort lessons (subject, location, price, spaces) with asc/desc toggle
- 🛒 Add lessons to cart (with real-time space updates)
- ❌ Remove items from cart (restores available spaces)
- ✅ Checkout with name (letters only) and phone (numbers only) validation
- 📱 Responsive design

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API URL (optional)
Create `.env` file for production API:
```env
VITE_API_URL=https://your-backend.onrender.com
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.vue         # Main application component
│   └── main.js         # Vue app entry point
├── index.html          # HTML template with Font Awesome CDN
├── vite.config.js      # Vite configuration
└── package.json
```

## 🌐 Deploy to GitHub Pages

1. Update `vite.config.js` with your repo name:
   ```js
   base: '/vue-frontend/'
   ```

2. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

   Or manually push `dist/` folder to `gh-pages` branch.

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

## 📄 License

MIT
