import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  PartialWithFieldValue,
  WithFieldValue,
} from 'firebase/firestore';

export function converter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: PartialWithFieldValue<T> | WithFieldValue<T>) {
      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<T, T>, options) {
      return snapshot.data(options);
    },
  };
}
