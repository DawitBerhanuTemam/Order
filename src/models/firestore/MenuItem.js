// Firestore MenuItem model
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { adminDb } from '@/libs/firebaseAdmin';

const COLLECTION_NAME = 'menuItems';

// Client-side operations
export const MenuItemModel = {
  async create(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  },

  async findById(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async getAll() {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};

// Server-side operations (for API routes)
export const MenuItemModelAdmin = {
  async create(data) {
    const docRef = await adminDb.collection(COLLECTION_NAME).add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  },

  async findById(id) {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async getAll() {
    const snapshot = await adminDb.collection(COLLECTION_NAME).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async findByCategory(categoryId) {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .where('category', '==', categoryId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id, data) {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id) {
    const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
    await docRef.delete();
  },
};
