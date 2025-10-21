// Firestore User model
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { adminDb } from '@/libs/firebaseAdmin';

const COLLECTION_NAME = 'users';

// Client-side operations
export const UserModel = {
  async create(userId, data) {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await setDoc(userRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: userId, ...data };
  },

  async findById(userId) {
    const userRef = doc(db, COLLECTION_NAME, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  },

  async findByEmail(email) {
    const q = query(collection(db, COLLECTION_NAME), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  },

  async update(userId, data) {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },
};

// Server-side operations (for API routes)
export const UserModelAdmin = {
  async create(userId, data) {
    const userRef = adminDb.collection(COLLECTION_NAME).doc(userId);
    await userRef.set({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: userId, ...data };
  },

  async findById(userId) {
    const userRef = adminDb.collection(COLLECTION_NAME).doc(userId);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  },

  async findByEmail(email) {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  },

  async update(userId, data) {
    const userRef = adminDb.collection(COLLECTION_NAME).doc(userId);
    await userRef.update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async getAll() {
    const snapshot = await adminDb.collection(COLLECTION_NAME).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};
