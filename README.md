# BrainVault - Personal Notes & File Vault

A secure, feature-rich web application for managing notes and files with public/private sharing capabilities.

## Features

- **Secure Authentication**: Email/password authentication via Supabase
- **Rich Notes**: Create, edit, and organize notes with autosave
- **File Management**: Upload PDFs and images with public/private visibility
- **Public Gallery**: View and download publicly shared files
- **Folder Organization**: Organize notes and files into folders
- **Search**: Full-text search across your notes
- **Dark/Light Mode**: Toggle between themes
- **Real-time Stats**: Dashboard with activity overview

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd brainvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)

   b. Run the database migration:
      - Go to SQL Editor in Supabase Dashboard
      - Copy and run the migration from your database (already applied via MCP)

   c. Set up Storage:
      - Go to SQL Editor
      - Run the contents of `STORAGE_SETUP.sql`

   d. Get your credentials:
      - Go to Settings > API
      - Copy your Project URL and anon/public key

4. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
brainvault/
├── src/
│   ├── components/
│   │   ├── Auth/          # Authentication components
│   │   ├── Dashboard/     # Dashboard view
│   │   ├── Files/         # File management & public gallery
│   │   ├── Folders/       # Folder organization
│   │   ├── Layout/        # Layout components (Sidebar)
│   │   └── Notes/         # Notes views and editor
│   ├── contexts/          # React contexts (Auth, Theme)
│   ├── lib/               # Supabase client and types
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── STORAGE_SETUP.sql      # Supabase storage bucket setup
└── README.md              # This file
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

## Usage Guide

### Creating Notes

1. Navigate to "My Notes" from the sidebar
2. Click "New Note" button
3. Edit the title and content
4. Changes are auto-saved every 800ms
5. Toggle public/private visibility with the eye icon

### Uploading Files

1. Navigate to "My Files" from the sidebar
2. Click "Upload File" button
3. Select a PDF or image
4. Toggle public/private visibility with the eye icon
5. Download or delete files as needed

### Public Gallery

- Navigate to "Public Gallery" to view all publicly shared files
- Anyone can view and download public files
- Click on a file to preview (images and PDFs)
- Download files with the download button

### Organizing with Folders

1. Navigate to "Folders" from the sidebar
2. Click "New Folder" to create folders
3. Name your folder and save
4. Assign notes/files to folders when creating them

## Security Features

- **Row Level Security (RLS)**: All database tables protected with RLS policies
- **User Isolation**: Users can only modify their own data
- **Public Content**: Public files accessible via direct URL
- **Secure Storage**: Files stored in user-specific folders
- **Auth Protection**: All mutations require authentication

## Performance Optimizations

- Debounced autosave for notes (800ms)
- Optimized queries with proper indexes
- Full-text search with tsvector
- Lazy loading and code splitting
- Responsive design for all devices

## Troubleshooting

### Storage Policy Issues

If you can't upload files:
1. Check that `STORAGE_SETUP.sql` was run correctly
2. Verify the bucket `public-files` exists
3. Ensure RLS policies are active on `storage.objects`

### Authentication Issues

If you can't sign in:
1. Verify environment variables are correct
2. Check Supabase Auth settings
3. Ensure email confirmation is disabled (for MVP)

### Build Errors

If the build fails:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check for TypeScript errors with `npm run typecheck`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review Supabase documentation

## Roadmap

Future enhancements:
- [ ] Tags for notes
- [ ] Rich text editor (TipTap/Quill)
- [ ] PDF text extraction and search
- [ ] Collaborative notes
- [ ] Mobile app
- [ ] Export notes to PDF
- [ ] Email notifications
- [ ] File version history

---

Built with ❤️ using React, TypeScript, and Supabase
