# BrainVault - System Architecture

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BrainVault                            │
│              Personal Notes & File Vault                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth UI    │  │  Dashboard   │  │    Notes     │      │
│  │  - Login     │  │  - Stats     │  │  - Editor    │      │
│  │  - Signup    │  │  - Overview  │  │  - List      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Files     │  │   Gallery    │  │   Folders    │      │
│  │  - Upload    │  │  - Public    │  │  - Organize  │      │
│  │  - Manage    │  │  - Browse    │  │  - Create    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │           Context Providers                       │       │
│  │  - AuthContext (user, session)                   │       │
│  │  - ThemeContext (dark/light)                     │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Supabase Client
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Backend                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │              Authentication                    │          │
│  │  - Email/Password                             │          │
│  │  - Session Management                         │          │
│  │  - JWT Tokens                                 │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │           PostgreSQL Database                 │          │
│  │                                                │          │
│  │  Tables:                                       │          │
│  │  ├─ profiles (user info)                      │          │
│  │  ├─ notes (content + search)                  │          │
│  │  ├─ files (metadata)                          │          │
│  │  ├─ folders (organization)                    │          │
│  │  ├─ tags (categorization)                     │          │
│  │  └─ note_tags (junction)                      │          │
│  │                                                │          │
│  │  Security:                                     │          │
│  │  ├─ Row Level Security (RLS)                  │          │
│  │  ├─ User isolation                            │          │
│  │  └─ Public content policies                   │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │               Storage                          │          │
│  │                                                │          │
│  │  Bucket: public-files                         │          │
│  │  ├─ User folders (user_id/)                   │          │
│  │  ├─ Public access                             │          │
│  │  └─ Secure policies                           │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │          Full-Text Search                      │          │
│  │  - tsvector on notes                          │          │
│  │  - GIN indexes                                │          │
│  │  - Real-time updates                          │          │
│  └───────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### User Authentication Flow
```
User Input → AuthContext → Supabase Auth → Session
                                              ↓
                                        User Object
                                              ↓
                                     Protected Routes
```

### Note Creation Flow
```
User Types → Debounce (800ms) → Update State
                                      ↓
                            Supabase INSERT/UPDATE
                                      ↓
                              Database (with RLS)
                                      ↓
                              Trigger (tsvector)
```

### File Upload Flow
```
File Select → Validation → Supabase Storage Upload
                                    ↓
                          Generate Storage Path
                                    ↓
                          Insert Metadata (files table)
                                    ↓
                                Success
```

### Public Gallery Flow
```
Public Gallery → Query (is_public = true) → Files
                                               ↓
                                      Display Grid
                                               ↓
                                   Download/Preview
```

## 🔐 Security Layers

```
┌────────────────────────────────────────┐
│         Application Layer              │
│  - Client-side route protection        │
│  - Context-based auth checks           │
└────────────────────────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│           API Layer                    │
│  - Supabase Auth verification          │
│  - JWT token validation                │
└────────────────────────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│        Database Layer (RLS)            │
│  - User-scoped policies                │
│  - Public content policies             │
│  - Ownership verification              │
└────────────────────────────────────────┘
                  ↓
┌────────────────────────────────────────┐
│         Storage Layer                  │
│  - Bucket-level policies               │
│  - Path-based access control           │
│  - Owner-only modifications            │
└────────────────────────────────────────┘
```

## 📊 Database Schema

```sql
profiles
├── id (PK, FK auth.users)
├── email
├── full_name
├── avatar_url
├── created_at
└── updated_at

notes
├── id (PK)
├── user_id (FK)
├── folder_id (FK, nullable)
├── title
├── content
├── is_public
├── content_tsv (tsvector)
├── created_at
└── updated_at

files
├── id (PK)
├── user_id (FK)
├── folder_id (FK, nullable)
├── name
├── storage_path
├── file_type
├── file_size
├── is_public
├── download_count
├── created_at
└── updated_at

folders
├── id (PK)
├── user_id (FK)
├── name
├── parent_id (FK, nullable)
├── created_at
└── updated_at

tags
├── id (PK)
├── user_id (FK)
├── name
├── color
└── created_at

note_tags
├── note_id (PK, FK)
└── tag_id (PK, FK)
```

## 🎨 Component Hierarchy

```
App
├── ThemeProvider
│   └── AuthProvider
│       ├── LoginForm (unauthenticated)
│       └── MainLayout (authenticated)
│           ├── Sidebar
│           │   ├── Navigation
│           │   ├── Theme Toggle
│           │   └── Logout
│           └── ContentArea
│               ├── DashboardView
│               ├── NotesView
│               │   ├── NotesList
│               │   └── NoteEditor
│               ├── FileManager
│               ├── PublicGallery
│               └── FoldersView
```

## 🔌 API Integration Points

### Supabase Client Methods Used

**Auth:**
- `supabase.auth.signUp()`
- `supabase.auth.signInWithPassword()`
- `supabase.auth.signOut()`
- `supabase.auth.getSession()`
- `supabase.auth.onAuthStateChange()`

**Database:**
- `supabase.from('table').select()`
- `supabase.from('table').insert()`
- `supabase.from('table').update()`
- `supabase.from('table').delete()`
- `.eq()`, `.order()`, `.maybeSingle()`

**Storage:**
- `supabase.storage.from('bucket').upload()`
- `supabase.storage.from('bucket').download()`
- `supabase.storage.from('bucket').remove()`
- `supabase.storage.from('bucket').getPublicUrl()`

## 🚀 Build & Deploy Pipeline

```
Source Code
     ↓
TypeScript Compilation
     ↓
Vite Build Process
     ↓
Bundle Optimization
     ↓
Static Assets (dist/)
     ↓
Deploy to Hosting
(Vercel/Netlify)
```

## 📈 Performance Optimizations

1. **Code Splitting**: Dynamic imports for components
2. **Tree Shaking**: Unused code eliminated
3. **Lazy Loading**: Images and components
4. **Debouncing**: Autosave and search
5. **Caching**: Supabase client caching
6. **Indexes**: Database query optimization
7. **Compression**: Gzip/Brotli on build

## 🔍 Monitoring Points

- Authentication success/failure rates
- File upload success rates
- Note save operations
- Search query performance
- Page load times
- Error rates by component
- Public gallery views
- Download statistics

---

**Architecture Version**: 1.0.0
**Last Updated**: 2025-11-15
