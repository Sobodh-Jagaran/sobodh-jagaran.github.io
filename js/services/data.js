import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set} from "firebase/database";

const appId = "online-portfolio-cms";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
;
const initialAuthToken = auth.currentUser ? auth.currentUser.za : null;

export async function initializeFirebaseAndAuth() {
    return { auth, db };
}

export async function saveResumeData(path, data) {
    if (!path) throw new Error("saveResumeData: path is required");
    if (!data) throw new Error("saveResumeData: data is required");
    const dataRef = ref(db, path);
    await set(dataRef, data);
}

export async function loadResume() {
    return await firebaseResumeData() || await jsonFileResumeData()
}

async function firebaseResumeData() {
    const database = getDatabase()
    const resumeRef = ref(database, 'resume');
    const snapshot = await get(resumeRef);
    const data = snapshot.val();
    return data;
}

async function jsonFileResumeData() {
    const response = await fetch("./resume.json");
    if (!response.ok) throw new Error(`Failed to load resume.json (${response.status})`);
    return response.json();
}

export async function loadMediaAssets() {
    const database = getDatabase()
    const mediaRef = ref(database, 'assets');
    const snapshot = await get(mediaRef);
    const data = snapshot.val();
    return data;
}

export async function saveMediaAssets(assets) {
    if (!assets) throw new Error("Assets data is required");
    const dataRef = ref(db, "assets");
    await set(dataRef, assets);
}

export async function loadConfig() {
    const database = getDatabase()
    const configRef = ref(database, 'config');
    const snapshot = await get(configRef);
    let data = snapshot.exists() ? snapshot.val() :  null;
    if (data === null) {
        data =  {
            siteTitle: 'Sobodh Jagaran | Full-Stack Developer & Systems Architect',
            siteDescription: "Sobodh Jagaran: Don't Just Write Code. Architect Reliability. Polyglot Full-Stack Developer and Systems Architect with 10+ years of experience in Java, C#, Angular, and robust system automation.",
            gaId: '',
            maintenanceMode: false
        };
    }
    return data;
}

export async function saveConfig(config) {
    if (!config) throw new Error("Config data is required");
    const dataRef = ref(db, "config");
    await set(dataRef, config);
}

export const handlePasswordReset = async () => {
    const auth = getAuth();
    if (!auth.currentUser?.email) return;
    try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        alertMessage('Reset link sent to your email', 'success');
    } catch (err) {
        alertMessage('Error sending reset link', 'error');
    }
};