import { connectAuthEmulator, getAuth } from "firebase/auth";
import { app } from "./app";

const auth = getAuth(app);

// Only connect to emulator in development
if (import.meta.env.DEV) {
    connectAuthEmulator(auth, "http://localhost:9099");
}

export { auth };