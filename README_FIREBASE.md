# 🔥 Firebase Migration - Quick Start

Your food ordering app is ready to be migrated to Firebase! All the infrastructure has been created for you.

## 📦 What's Been Created

### Core Files
- **Firebase SDKs**: `src/libs/firebase.js` & `src/libs/firebaseAdmin.js`
- **Auth System**: `src/components/FirebaseAuthContext.js`
- **Data Models**: `src/models/firestore/` (User, MenuItem, Order, Category)
- **Auth Helpers**: `src/libs/firebaseAuthHelpers.js`
- **API Hooks**: `src/hooks/useAuthenticatedFetch.js`

### Configuration
- **Firebase Config**: `firebase.json`
- **Security Rules**: `firestore.rules` & `storage.rules`
- **Indexes**: `firestore.indexes.json`
- **Environment**: `.env.local` (template)

### Documentation
- **Complete Guide**: `FIREBASE_MIGRATION_GUIDE.md`
- **Progress Tracker**: `MIGRATION_SUMMARY.md`
- **Setup Script**: `scripts/setup-firebase.sh`

## 🚀 Quick Start (30 minutes)

### 1. Install Firebase CLI & Dependencies
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Install Firebase packages (installing now...)
npm install --legacy-peer-deps firebase firebase-admin
```

### 2. Set Up Firebase Project
```bash
# Run the setup script
./scripts/setup-firebase.sh

# Or manually:
firebase login
firebase init
```

Select: Firestore, Functions, Hosting, Storage

### 3. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select your project
3. Go to Project Settings > General
4. Copy config values to `.env.local`
5. Go to Service Accounts > Generate new private key
6. Add Admin SDK credentials to `.env.local`

### 4. Enable Authentication

1. Firebase Console > Authentication > Sign-in method
2. Enable **Email/Password**
3. Enable **Google** (add OAuth credentials)

### 5. Deploy Security Rules
```bash
firebase deploy --only firestore:rules,storage
```

## 📋 Next Steps

### Option A: Quick Test (Recommended First)
Test with Firebase Emulators locally:
```bash
firebase emulators:start
npm run dev
```

### Option B: Full Migration
Follow the complete guide in `FIREBASE_MIGRATION_GUIDE.md`

**Estimated time**: 8-12 hours for full migration

## 🎯 Migration Checklist

### Infrastructure ✅ (Done)
- [x] Firebase configuration files
- [x] Firestore models
- [x] Authentication system
- [x] Security rules
- [x] Helper utilities

### Your Tasks ⏳
- [ ] Set up Firebase project in console
- [ ] Update `.env.local` with your credentials
- [ ] Update `src/app/layout.js` with FirebaseAuthProvider
- [ ] Migrate 9 API routes (see guide)
- [ ] Update components to use Firebase Auth
- [ ] Test locally
- [ ] Deploy

## 📚 Key Documents

1. **Start Here**: `MIGRATION_SUMMARY.md` - Overview and progress tracker
2. **Detailed Guide**: `FIREBASE_MIGRATION_GUIDE.md` - Step-by-step instructions
3. **Example Code**: `src/app/api/categories/route.firebase.js` - API route template

## 🔧 Important Configuration Changes

### Update `next.config.js`
```javascript
module.exports = {
  output: 'export', // For static export to Firebase Hosting
  images: {
    unoptimized: true, // Firebase doesn't support Next.js image optimization
  },
}
```

### Update `src/app/layout.js`
```javascript
import { FirebaseAuthProvider } from '@/components/FirebaseAuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FirebaseAuthProvider>
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
```

## 🎨 Architecture Overview

### Before (Current)
```
MongoDB + Mongoose
NextAuth (Email + Google)
AWS S3 (Images)
Stripe (Payments)
```

### After (Firebase)
```
Firestore (Database)
Firebase Auth (Email + Google)
Firebase Storage (Images)
Stripe (Payments - unchanged)
```

## 💡 Pro Tips

1. **Keep MongoDB running** during migration for reference
2. **Test with emulators** before deploying
3. **Migrate one API route at a time** and test
4. **Use the example route** as a template
5. **Check Firebase Console** for detailed error logs

## 🆘 Need Help?

### Common Issues

**"Firebase not initialized"**
- Check `.env.local` has all required values
- Restart dev server after updating env vars

**"Permission denied" in Firestore**
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check user is authenticated
- Verify admin flag for admin operations

**Build errors**
- Run `npm install --legacy-peer-deps`
- Check all imports are correct

### Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## 🎉 Benefits

- ✅ **No database management** - Firebase handles scaling
- ✅ **Real-time updates** - Built-in real-time listeners
- ✅ **Better security** - Row-level security rules
- ✅ **Free tier** - Generous free tier
- ✅ **Easy deployment** - One command: `firebase deploy`
- ✅ **Global CDN** - Fast worldwide
- ✅ **Built-in analytics** - Firebase Analytics included

## 📊 Migration Time Estimate

- **Setup Firebase Project**: 15 minutes
- **Update Configuration**: 10 minutes
- **Migrate API Routes**: 2-3 hours
- **Update Components**: 1-2 hours
- **Testing**: 1-2 hours
- **Deployment**: 15 minutes

**Total**: 5-8 hours (depending on experience)

---

**Ready?** Start with `MIGRATION_SUMMARY.md` to see the complete roadmap!

Good luck! 🚀
