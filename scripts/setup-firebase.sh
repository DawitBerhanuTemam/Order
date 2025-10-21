#!/bin/bash

# Firebase Setup Script for Food Ordering App
# This script helps you set up Firebase for your project

echo "🔥 Firebase Setup for Food Ordering App"
echo "========================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI is already installed"
fi

echo ""
echo "🔐 Logging into Firebase..."
firebase login

echo ""
echo "🚀 Initializing Firebase project..."
echo "Please select the following options:"
echo "  - Firestore"
echo "  - Functions"
echo "  - Hosting"
echo "  - Storage"
echo ""
firebase init

echo ""
echo "✅ Firebase initialization complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Enable Authentication methods in Firebase Console"
echo "3. Deploy security rules: firebase deploy --only firestore:rules,storage"
echo "4. Build and deploy: npm run build && firebase deploy"
echo ""
echo "📖 See FIREBASE_MIGRATION_GUIDE.md for detailed instructions"
