# Portfolio v4 with Smart Financial Analyzer Bot

Portfolio website dengan integrasi Smart Financial Analyzer Bot yang memiliki visualisasi 3D interaktif dan sistem login.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/Shioonzzz/v4.git
cd v4

# Install dependencies
npm install

# Start development server
npm run develop
```

## 🤖 Bot Integration

### File Structure yang Ditambahkan
```
src/
├── components/
│   ├── BotLogin.js           # Komponen login bot
│   ├── BotDashboard.js       # Interface utama bot
│   └── Bot3DViewer.js        # Visualisasi 3D
├── hooks/
│   ├── useAuth.js            # Authentication hook
│   └── useBotAPI.js          # Bot API integration
├── pages/
│   └── financial-analyzer.js # Halaman utama bot
└── content/
    └── projects/
        └── smart-financial-analyzer.md  # Project content
```

### Demo Credentials
Untuk testing, gunakan kredensial berikut:
- **Email**: `demo@financialbot.com`
- **Password**: `demo123`

Atau:
- **Email**: `user@test.com` 
- **Password**: `password`

### Features Bot
- ✅ **AI-Powered Analysis**: Analisis keuangan dengan ML
- ✅ **3D Visualization**: Visualisasi data dengan Three.js
- ✅ **Authentication System**: Login/Register dengan session management
- ✅ **Real-time Chat**: Interface chat dengan bot
- ✅ **Demo Mode**: Preview tanpa login
- ✅ **Responsive Design**: Mobile-friendly interface

## 📁 File Integration Guide

### 1. Content Files
```bash
# Buat file markdown untuk project
content/projects/smart-financial-analyzer.md
```

### 2. Page Components  
```bash
# Halaman utama bot
src/pages/financial-analyzer.js
```

### 3. React Components
```bash
# Komponen login
src/components/BotLogin.js

# Dashboard bot
src/components/BotDashboard.js

# 3D Viewer untuk model Anda
src/components/Bot3DViewer.js
```

### 4. Hooks & Utils
```bash
# Authentication logic
src/hooks/useAuth.js

# Bot API integration
src/hooks/useBotAPI.js
```

### 5. Navigation Updates
```bash
# Update navigasi untuk include bot link
src/components/nav.js

# Update projects section
src/components/sections/Projects.js
```

### 6. Configuration
```bash
# Gatsby configuration
gatsby-config.js
gatsby-node.js
gatsby-browser.js

# Dependencies
package.json
```

## 🎨 3D Model Integration

### Menambahkan 3D File Anda

1. **Letakkan file 3D** di folder `static/models/`:
   ```bash
   static/
   └── models/
       └── your-3d-model.glb  # atau .gltf, .fbx, .obj
   ```

2. **Update Bot3DViewer.js**:
   ```javascript
   // Ganti di dalam createFinancialVisualization()
   const loader = new GLTFLoader();
   loader.load('/models/your-3d-model.glb', (gltf) => {
     const model = gltf.scene;
     model.scale.set(2, 2, 2);
     sceneRef.current.add(model);
     objectsRef.current.customModel = model;
   });
   ```

3. **Animasi Custom**:
   ```javascript
   // Dalam animate() function
   if (objectsRef.current.customModel) {
     objectsRef.current.customModel.rotation.y += 0.01;
   }
   ```

## 🔧 Customization

### Mengubah Warna Theme
Edit di `src/styles/variables.js`:
```javascript
colors: {
  green: '#64ffda',     // Warna aksen utama
  navy: '#0a192f',      // Background gelap
  lightNavy: '#112240', // Background komponen
  // dst...
}
```

### Menambah Fitur Bot Baru
1. Tambah function di `useBotAPI.js`
2. Update response logic di `simulateBotResponse()`  
3. Tambah UI components di `BotDashboard.js`

### Custom Authentication
Replace memory storage dengan real backend:
```javascript
// Di useAuth.js
const saveUserToStorage = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};
```

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Build production
npm run build

# Deploy to Netlify
# Connect your repo dan set build command: npm run build
# Publish directory: public/
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy  
vercel
```

### Manual Deploy
```bash
# Build static files
npm run build

# Upload folder 'public/' ke hosting Anda
```

## 🔒 Security Notes

⚠️ **Important**: File yang disediakan menggunakan in-memory storage untuk demo. Untuk production:

1. **Ganti dengan real backend authentication**
2. **Implementasi proper session management** 
3. **Add input validation & sanitization**
4. **Setup HTTPS dan security headers**
5. **Implement rate limiting untuk API calls**

## 📱 Mobile Optimization

Bot sudah responsive, tapi untuk optimasi lebih lanjut:
- Test di berbagai device sizes
- Optimasi 3D rendering untuk mobile
- Pertimbangkan lazy loading untuk model 3D

## 🐛 Troubleshooting

### Three.js Build Issues
```bash
# Jika ada error dengan Three.js saat build
npm install --save-dev @types/three
```

### Memory Storage Warning  
Ini normal untuk demo. User data akan hilang saat refresh. Implement localStorage atau backend untuk persistence.

### 3D Model Tidak Muncul
1. Check file path di `static/models/`
2. Pastikan format file didukung (GLB recommended)
3. Check browser console untuk error

## 📞 Support

Jika ada pertanyaan atau butuh bantuan integrasi:
1. Check GitHub Issues
2. Review kode comments
3. Test di development mode dulu

## 🎯 Next Steps

Setelah integrasi berhasil:
1. **Replace demo data** dengan real financial data
2. **Integrate dengan backend API** untuk authentication  
3. **Add real financial calculations** 
4. **Implement data persistence**
5. **Add more 3D interactions**
6. **Setup analytics tracking**

---

**Happy coding! 🚀** Semoga bot financial analyzer Anda sukses!