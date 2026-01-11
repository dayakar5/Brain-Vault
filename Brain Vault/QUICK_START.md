# 🚀 BrainVault - Quick Start

## ⚡ 3-Minute Setup

### 1. Environment Setup
```bash
# Create .env file
cp .env.example .env

# Add your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

---

## 📋 What's Included

✅ **Database**: Fully configured with RLS
✅ **Storage**: Public files bucket ready
✅ **Auth**: Email/password authentication
✅ **UI**: Beautiful animated interface

---

## 🎯 First Steps

1. **Sign Up**: Create your account
2. **Create Note**: Write your first note
3. **Upload File**: Add a PDF or image
4. **Make Public**: Toggle a file to public
5. **View Gallery**: Check the public gallery

---

## 📚 Documentation

- `SETUP_GUIDE.md` - Detailed setup instructions
- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Technical overview
- `STORAGE_SETUP.sql` - Storage configuration

---

## 🆘 Quick Troubleshooting

**Can't upload files?**
→ Check Supabase credentials in `.env`

**Notes not saving?**
→ Check browser console for errors

**Build fails?**
→ Run `npm install` again

---

## 🎨 Features at a Glance

| Feature | Status |
|---------|--------|
| Authentication | ✅ |
| Notes (CRUD) | ✅ |
| File Upload | ✅ |
| Public Gallery | ✅ |
| Search | ✅ |
| Folders | ✅ |
| Dark/Light Mode | ✅ |
| Animations | ✅ |
| Responsive | ✅ |

---

## 🚢 Deploy Now

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

---

## 💡 Pro Tips

- Notes autosave after 800ms
- Use search to find notes quickly
- Public files are accessible to anyone
- Toggle theme in sidebar
- All data is secure with RLS

---

**Need help?** Check `SETUP_GUIDE.md` or `README.md`

**Ready to code?** Start editing in `src/`

**Want to customize?** Check `tailwind.config.js` for theme
