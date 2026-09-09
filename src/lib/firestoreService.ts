import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Garment, Outfit } from '../types';

/**
 * Real-time listener for user's garments
 */
export function subscribeToGarments(
  userId: string,
  onData: (garments: Garment[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/garments`;
  try {
    const garmentsRef = collection(db, 'users', userId, 'garments');
    const q = query(garmentsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const garments: Garment[] = [];
        snapshot.forEach((docSnap) => {
          garments.push(docSnap.data() as Garment);
        });
        onData(garments);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (e) {
          onError?.(e as Error);
        }
      }
    );
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (e) {
      onError?.(e as Error);
    }
    return () => {};
  }
}

/**
 * Save or update a garment in Firestore
 */
export async function saveGarmentToFirestore(userId: string, garment: Garment): Promise<void> {
  const path = `users/${userId}/garments/${garment.id}`;
  try {
    const garmentRef = doc(db, 'users', userId, 'garments', garment.id);
    const dataToSave: Garment = {
      ...garment,
      userId,
    };
    await setDoc(garmentRef, dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a garment from Firestore
 */
export async function deleteGarmentFromFirestore(userId: string, garmentId: string): Promise<void> {
  const path = `users/${userId}/garments/${garmentId}`;
  try {
    const garmentRef = doc(db, 'users', userId, 'garments', garmentId);
    await deleteDoc(garmentRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for user's outfits
 */
export function subscribeToOutfits(
  userId: string,
  onData: (outfits: Outfit[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/outfits`;
  try {
    const outfitsRef = collection(db, 'users', userId, 'outfits');
    const q = query(outfitsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const outfits: Outfit[] = [];
        snapshot.forEach((docSnap) => {
          outfits.push(docSnap.data() as Outfit);
        });
        onData(outfits);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (e) {
          onError?.(e as Error);
        }
      }
    );
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (e) {
      onError?.(e as Error);
    }
    return () => {};
  }
}

/**
 * Save or update an outfit in Firestore
 */
export async function saveOutfitToFirestore(userId: string, outfit: Outfit): Promise<void> {
  const path = `users/${userId}/outfits/${outfit.id}`;
  try {
    const outfitRef = doc(db, 'users', userId, 'outfits', outfit.id);
    const dataToSave: Outfit = {
      ...outfit,
      userId,
    };
    await setDoc(outfitRef, dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an outfit from Firestore
 */
export async function deleteOutfitFromFirestore(userId: string, outfitId: string): Promise<void> {
  const path = `users/${userId}/outfits/${outfitId}`;
  try {
    const outfitRef = doc(db, 'users', userId, 'outfits', outfitId);
    await deleteDoc(outfitRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
