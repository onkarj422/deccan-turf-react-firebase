import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { app } from './app';

const db = getFirestore(app);

if (import.meta.env.DEV) {
    connectFirestoreEmulator(db, 'localhost', 8080);
}

export {
    db,
};
