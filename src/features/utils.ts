import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
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

function handleAuthError(error: unknown): string {
  let message = '';
  if (!(error instanceof FirebaseError)) {
    message = String(error);
  }
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case AuthErrorCodes.USER_DELETED:
        message = 'Usuário não existe';
        break;
      case AuthErrorCodes.INVALID_PASSWORD:
        message = 'Senha incorreta';
        break;
      case AuthErrorCodes.EMAIL_EXISTS:
        message = 'E-mail já em uso';
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        message = 'E-mail inválido';
        break;
      case AuthErrorCodes.WEAK_PASSWORD:
        message = 'Senha muito fraca';
        break;
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        message = 'Operação cancelada';
        break;
      case AuthErrorCodes.POPUP_BLOCKED:
        message = 'Operação bloqueada';
        break;
      case AuthErrorCodes.ADMIN_ONLY_OPERATION:
        message = 'Operação restrita';
        break;
    }
  }
  return message;
}

export function handleError(error: unknown): string {
  if (error instanceof FirebaseError) {
    return handleAuthError(error);
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'Algo deu errado, tente novamente mais tarde';
  }
}
