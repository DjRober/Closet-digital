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

/** Firestore rechaza valores `undefined`; los eliminamos de forma recursiva. */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

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
 * Validate garment data before storing
 */
export function validateGarmentData(garment: Garment): void {
  if (!garment.type || !garment.type.trim()) {
    throw new Error('El tipo de prenda es obligatorio y no puede ir vacío.');
  }
  if (garment.type.trim().length > 50) {
    throw new Error('El tipo de prenda es demasiado largo (máximo 50 caracteres).');
  }
  if (!garment.color || !garment.color.trim()) {
    throw new Error('El color de la prenda es obligatorio y no puede ir vacío.');
  }
  if (garment.color.trim().length > 40) {
    throw new Error('El color de la prenda es demasiado largo (máximo 40 caracteres).');
  }
}

/**
 * Validate outfit data before storing
 */
export function validateOutfitData(outfit: Outfit): void {
  if (!outfit.name || !outfit.name.trim()) {
    throw new Error('El nombre del outfit es obligatorio y no puede ir vacío.');
  }
  if (outfit.name.trim().length > 60) {
    throw new Error('El nombre del outfit es demasiado largo (máximo 60 caracteres).');
  }
  if (!outfit.garmentIds || outfit.garmentIds.length === 0) {
    throw new Error('El outfit debe incluir al menos una prenda.');
  }
  if (outfit.occasion && outfit.occasion.trim().length > 40) {
    throw new Error('La ocasión es demasiado larga (máximo 40 caracteres).');
  }
}

/**
 * Save or update a garment in Firestore
 */
export async function saveGarmentToFirestore(userId: string, garment: Garment): Promise<void> {
  validateGarmentData(garment);
  const path = `users/${userId}/garments/${garment.id}`;
  try {
    const garmentRef = doc(db, 'users', userId, 'garments', garment.id);
    const dataToSave = stripUndefined<Garment>({
      ...garment,
      type: garment.type.trim(),
      color: garment.color.trim(),
      userId,
    });
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
  validateOutfitData(outfit);
  const path = `users/${userId}/outfits/${outfit.id}`;
  try {
    const outfitRef = doc(db, 'users', userId, 'outfits', outfit.id);
    const dataToSave = stripUndefined<Outfit>({
      ...outfit,
      name: outfit.name.trim(),
      occasion: outfit.occasion?.trim() || undefined,
      userId,
    });
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
