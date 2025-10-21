# 🚀 Deploy to Firebase - Step by Step

## ⚠️ Important Note

Your app currently uses **API routes and MongoDB**, which won't work with Firebase Hosting's static export. You have two deployment options:

### Option A: Quick Deploy (Static Only - Limited Functionality)
- ✅ Fast deployment
- ❌ No authentication
- ❌ No database operations
- ❌ No checkout/orders
- 👉 Good for: Testing the UI only

### Option B: Full Migration (Complete Functionality) 
- ✅ Full authentication
- ✅ Database operations
- ✅ All features work
- ⏰ Requires: 8-12 hours of migration work
- 👉 Good for: Production deployment

---

## 🎯 Recommended: Option B (Full Migration)

Since you want a working food ordering app, you need to complete the Firebase migration.

## Step-by-Step Deployment

### Step 1: Set Up Firebase Project (15 minutes)

1. **Go to Firebase Console**
   ```
   https://console.firebase.google.com/
   ```

2. **Create a new project**
   - Click "Add project"
   - Name it (e.g., "food-ordering-app")
   - Disable Google Analytics (optional)
   - Click "Create project"

3. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable **Email/Password**
   - Enable **Google** (you'll need OAuth credentials)

4. **Create Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in **production mode**
   - Choose a location (e.g., us-central)

5. **Enable Storage**
   - Go to Storage
   - Click "Get started"
   - Start in **production mode**

### Step 2: Get Firebase Configuration (5 minutes)

1. **Get Web App Config**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click the web icon (</>)
   - Register app
   - Copy the config values

2. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
   ```

3. **Get Admin SDK Credentials**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Add to `.env.local`:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
   ```

### Step 3: Initialize Firebase in Your Project (5 minutes)

```bash
# Login to Firebase
firebase login

# Initialize Firebase
firebase init
```

**Select these options:**
- ✅ Firestore
- ✅ Hosting
- ✅ Storage

**When prompted:**
- Firestore rules: Use existing `firestore.rules`
- Firestore indexes: Use existing `firestore.indexes.json`
- Public directory: `out`
- Single-page app: `Yes`
- Storage rules: Use existing `storage.rules`

### Step 4: Deploy Security Rules (2 minutes)

```bash
firebase deploy --only firestore:rules,storage
```

This deploys your database and storage security rules.

### Step 5: Build Your App (2 minutes)

```bash
pnpm run build
```

**⚠️ This will likely fail** because your app uses API routes, which don't work with static export.

---

## 🔧 What Needs to Be Fixed

Your app currently has these files that won't work with Firebase Hosting:

### API Routes (Need Migration)
1. `src/app/api/auth/[...nextauth]/route.js` - Replace with Firebase Auth
2. `src/app/api/register/route.js` - Use Firebase Auth directly
3. `src/app/api/profile/route.js` - Use Firestore directly
4. `src/app/api/categories/route.js` - Use Firestore directly
5. `src/app/api/menu-items/route.js` - Use Firestore directly
6. `src/app/api/orders/route.js` - Use Firestore directly
7. `src/app/api/users/route.js` - Use Firestore directly
8. `src/app/api/upload/route.js` - Use Firebase Storage directly
9. `src/app/api/checkout/route.js` - Keep Stripe, use Cloud Function
10. `src/app/api/webhook/route.js` - Move to Cloud Function

---

## 🚀 Quick Deploy (Testing Only)

If you just want to see the UI deployed (without functionality):

```bash
# Temporarily disable API routes
# Comment out output: 'export' in next.config.js

# Build
pnpm run build

# Deploy
firebase deploy --only hosting
```

Your site will be live at: `https://your-project-id.web.app`

**But nothing will work** (no login, no orders, no data).

---

## ✅ Proper Deployment (Full Functionality)

To deploy with full functionality, you need to:

1. **Update Layout** - Wrap app with FirebaseAuthProvider
2. **Migrate API Routes** - Convert to client-side Firebase calls or Cloud Functions
3. **Update Components** - Replace NextAuth with Firebase Auth
4. **Test Locally** - Use Firebase emulators
5. **Deploy** - Build and deploy to Firebase

**Estimated time:** 8-12 hours

See `FIREBASE_MIGRATION_GUIDE.md` for complete instructions.

---

## 🎯 My Recommendation

**For a working production app**, you should either:

1. **Complete the Firebase migration** (8-12 hours)
   - Follow `FIREBASE_MIGRATION_GUIDE.md`
   - All features will work
   - Fully serverless

2. **Deploy to Vercel instead** (5 minutes)
   - No code changes needed
   - Everything works immediately
   - Free tier available
   - Built for Next.js

### Deploy to Vercel (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

That's it! Your app will be live with all features working.

---

## 📝 Summary

| Option | Time | Effort | Features |
|--------|------|--------|----------|
| Firebase (Static) | 30 min | Low | UI only |
| Firebase (Full) | 8-12 hrs | High | All features |
| Vercel | 5 min | None | All features |

**What would you like to do?**
