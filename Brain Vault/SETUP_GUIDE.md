# BrainVault - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your Supabase Credentials

1. The database schema and storage bucket have already been set up automatically
2. Get your Supabase credentials:
   - **Project URL**: Found in your Supabase project settings
   - **Anon Key**: Found in Settings > API

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Install & Run

```bash
npm install
npm run dev
```

That's it! Open your browser and start using BrainVault.

---

## 📋 What's Already Set Up

✅ **Database Schema**: All tables (profiles, notes, files, folders, tags) created with RLS policies
✅ **Storage Bucket**: `public-files` bucket created with access policies
✅ **Authentication**: Supabase Auth configured for email/password
✅ **Full-Text Search**: Notes searchable with tsvector indexes
✅ **Security**: Row Level Security enabled on all tables

---

## 🎨 Features Overview

### For Users (With Account)
- **Create Notes**: Rich text notes with autosave
- **Upload Files**: PDFs and images with public/private options
- **Organize**: Use folders to keep everything tidy
- **Search**: Full-text search across all your notes
- **Share**: Make files public for anyone to download

### For Visitors (No Account)
- **Browse Public Gallery**: View all publicly shared files
- **Download Files**: Download any public file
- **Preview**: View images and PDFs inline

---

## 🔒 Security Features

- **Row Level Security**: Users can only access their own data
- **Secure Storage**: Files stored in user-specific folders
- **Public Sharing**: Controlled visibility with is_public flag
- **Auth Protection**: All write operations require authentication

---

## 🎯 User Flow Examples

### Scenario 1: Private Note Taking
1. Sign up/Login
2. Create a new note
3. Write content (auto-saves)
4. Keep it private (default)
5. Search/organize with folders

### Scenario 2: Public File Sharing
1. Sign up/Login
2. Go to "My Files"
3. Upload a PDF or image
4. Toggle "Make Public"
5. Share link with anyone
6. They can view/download from Public Gallery

### Scenario 3: Browsing Public Content
1. Visit the website (no login needed)
2. Click "Public Gallery" (if visible to guests)
3. Browse public files
4. Preview and download

---

## 🛠️ Troubleshooting

### Can't Upload Files?
- Check that your `.env` file has correct credentials
- Verify storage bucket exists in Supabase dashboard
- Check browser console for specific errors

### Notes Not Saving?
- Check internet connection
- Verify Supabase credentials
- Look for "Saving..." indicator

### Build Errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📱 Responsive Design

The app works beautifully on:
- 💻 Desktop (1920px+)
- 💻 Laptop (1280px - 1920px)
- 📱 Tablet (768px - 1280px)
- 📱 Mobile (320px - 768px)

---

## 🎨 Customization

### Change Theme Colors
Edit `src/App.tsx` and component files:
- Primary gradient: `from-blue-500 to-purple-600`
- Background: `from-gray-900 via-blue-900 to-purple-900`

### Change Background Image
Edit `src/App.tsx` line with Pexels URL:
```tsx
bg-[url('https://images.pexels.com/your-image.jpeg')]
```

### Add More Animations
Check `tailwind.config.js` for animation utilities.

---

## 🚢 Deployment Checklist

### Vercel
- [ ] Push code to GitHub
- [ ] Import project in Vercel
- [ ] Add environment variables
- [ ] Deploy

### Netlify
- [ ] Push code to GitHub
- [ ] Import project in Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Add environment variables
- [ ] Deploy

---

## 📊 Database Structure

```
profiles
├── id (uuid, FK to auth.users)
├── email
├── full_name
└── avatar_url

notes
├── id (uuid)
├── user_id (FK)
├── title
├── content
├── is_public (boolean)
└── content_tsv (tsvector for search)

files
├── id (uuid)
├── user_id (FK)
├── name
├── storage_path
├── file_type
├── file_size
├── is_public (boolean)
└── download_count

folders
├── id (uuid)
├── user_id (FK)
├── name
└── parent_id (for nesting)

tags
├── id (uuid)
├── user_id (FK)
├── name
└── color
```

---

## 💡 Pro Tips

1. **Autosave**: Notes save automatically after 800ms of inactivity
2. **Search**: Use the search bar in "My Notes" to find content
3. **Public Links**: Copy file URLs from Public Gallery to share
4. **Keyboard Shortcuts**: Tab between form fields for faster input
5. **Dark Mode**: Toggle in the sidebar for comfortable viewing

---

## 🤝 Need Help?

- Check the main `README.md` for detailed information
- Review Supabase docs: https://supabase.com/docs
- Open an issue on GitHub
- Check browser console for errors

---

**Enjoy using BrainVault! 🧠💎**
