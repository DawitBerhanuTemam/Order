# Firebase Migration Guide

This guide will help you migrate your Next.js food ordering app from MongoDB + NextAuth to Firebase.

## 🚀 Quick Start

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase Project
```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting
- ✅ Storage

### 3. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General
4. Scroll to "Your apps" and click "Web app" icon
5. Copy the configuration values to `.env.local`

### 4. Get Firebase Admin SDK Credentials

1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract these values to `.env.local`:
   - `FIREBASE_PROJECT_ID`: project_id
   - `FIREBASE_CLIENT_EMAIL`: client_email
   - `FIREBASE_PRIVATE_KEY`: private_key (keep the quotes and newlines)

### 5. Enable Authentication Methods

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable:
   - ✅ Email/Password
   - ✅ Google (add OAuth credentials)

### 6. Update Next.js Configuration

Add to `next.config.js`:
```javascript
module.exports = {
  output: 'export', // For static export
  images: {
    unoptimized: true, // Firebase Hosting doesn't support Next.js Image Optimization
  },
}
```

## 📋 Migration Checklist

### ✅ Completed
- [x] Firebase configuration files created
- [x] Firestore models created (User, MenuItem, Order, Category)
- [x] Firebase Authentication context created
- [x] Security rules defined
- [x] Storage rules defined
- [x] Environment variables template updated

### 🔄 Manual Steps Required

#### Step 1: Update Layout to Use Firebase Auth
Replace `src/app/layout.js`:

```javascript
import { FirebaseAuthProvider } from '@/components/FirebaseAuthContext';
import './globals.css';

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

#### Step 2: Update API Routes

Each API route needs to be converted. Example for `src/app/api/menu-items/route.js`:

**Before (MongoDB + NextAuth):**
```javascript
import { MenuItem } from '@/models/MenuItem';
import mongoose from 'mongoose';

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  const items = await MenuItem.find();
  return Response.json(items);
}
```

**After (Firestore):**
```javascript
import { MenuItemModelAdmin } from '@/models/firestore/MenuItem';

export async function GET() {
  try {
    const items = await MenuItemModelAdmin.getAll();
    return Response.json(items);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

#### Step 3: Update Authentication in Components

**Before (NextAuth):**
```javascript
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
const userEmail = session?.user?.email;
```

**After (Firebase):**
```javascript
import { useAuth } from '@/components/FirebaseAuthContext';

const { user } = useAuth();
const userEmail = user?.email;
```

#### Step 4: Update Login Page

Replace `src/app/login/page.js` to use Firebase auth:

```javascript
'use client';
import { useAuth } from '@/components/FirebaseAuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    // Your login form JSX
  );
}
```

#### Step 5: Update Image Upload to Firebase Storage

Replace AWS S3 upload with Firebase Storage in `src/app/api/upload/route.js`:

```javascript
import { adminStorage } from '@/libs/firebaseAdmin';

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const bucket = adminStorage.bucket();
    const fileName = `images/${Date.now()}-${file.name}`;
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });
    
    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
    return Response.json({ url: publicUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

## 🔧 API Routes to Update

Update these files to use Firestore models:

1. ✅ `src/app/api/register/route.js` - Use Firebase Auth
2. ✅ `src/app/api/profile/route.js` - Use UserModelAdmin
3. ✅ `src/app/api/categories/route.js` - Use CategoryModelAdmin
4. ✅ `src/app/api/menu-items/route.js` - Use MenuItemModelAdmin
5. ✅ `src/app/api/orders/route.js` - Use OrderModelAdmin
6. ✅ `src/app/api/users/route.js` - Use UserModelAdmin
7. ✅ `src/app/api/upload/route.js` - Use Firebase Storage
8. ✅ `src/app/api/checkout/route.js` - Keep Stripe, update order creation
9. ✅ `src/app/api/webhook/route.js` - Keep Stripe, update order updates

## 🚀 Build and Deploy

### Build for Firebase Hosting

```bash
# Build Next.js app as static export
npm run build

# Deploy to Firebase
firebase deploy
```

### Deploy Functions (if needed)

If you need server-side functionality:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## ⚠️ Important Notes

### Limitations of Firebase Hosting + Static Export

1. **No Server-Side Rendering (SSR)**: All pages must be static or client-side rendered
2. **No API Routes in Production**: API routes won't work with static export
3. **No Image Optimization**: Next.js Image component optimization won't work

### Solutions

**Option A: Use Firebase Functions for API Routes**
- Move API routes to Cloud Functions
- Update frontend to call Cloud Functions URLs

**Option B: Use Client-Side Firebase SDK**
- Remove API routes entirely
- Call Firebase services directly from client components
- Better for real-time features

**Option C: Hybrid Approach (Recommended)**
- Use client-side Firebase for auth and real-time data
- Use Cloud Functions for sensitive operations (payments, admin actions)

## 📦 Dependencies to Install

```bash
npm install firebase firebase-admin
```

## 🗑️ Dependencies to Remove (Optional)

After migration is complete:

```bash
npm uninstall mongoose mongodb next-auth @auth/mongodb-adapter bcrypt @aws-sdk/client-s3
```

## 🔐 Security Checklist

- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Firebase Admin SDK credentials secured (never commit to git)
- [ ] Environment variables configured
- [ ] Google OAuth credentials configured
- [ ] Stripe webhook endpoints updated

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Cloud Functions](https://firebase.google.com/docs/functions)

## 🆘 Troubleshooting

### "Firebase not initialized" error
- Check that environment variables are set correctly
- Ensure Firebase config is loaded before use

### "Permission denied" in Firestore
- Check security rules
- Verify user is authenticated
- Check admin flag in user document

### Images not loading
- Verify Storage rules allow public read
- Check image URLs are correct
- Ensure files are uploaded to correct path

## 🎯 Next Steps

1. Set up Firebase project in console
2. Configure environment variables
3. Update API routes one by one
4. Test authentication flow
5. Test CRUD operations
6. Deploy to Firebase Hosting
7. Configure custom domain (optional)

---

**Need Help?** Check the Firebase Console for detailed error logs and monitoring.
