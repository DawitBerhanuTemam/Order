// Firestore Order model
import { collection, doc, getDoc, addDoc, updateDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { adminDb } from '@/libs/firebaseAdmin';

const COLLECTION_NAME = 'orders';

// Client-side operations
export const OrderModel = {
  async create(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      paid: data.paid || false,
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

  async findByUserEmail(email) {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userEmail', '==', email),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },
};

// Server-side operations (for API routes)
export const OrderModelAdmin = {
  async create(data) {
    const docRef = await adminDb.collection(COLLECTION_NAME).add({
      ...data,
      paid: data.paid || false,
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

  async findByUserEmail(email) {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .where('userEmail', '==', email)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getAll() {
    const snapshot = await adminDb.collection(COLLECTION_NAME)
      .orderBy('createdAt', 'desc')
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
};
