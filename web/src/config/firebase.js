// Optimized Firebase configuration with lazy loading
let app = null;
let auth = null;
let db = null;
let storage = null;
let functions = null;

const firebaseConfig = {
  apiKey: "AIzaSyBw4cMzV0LzPJhl71nlOz3f92zLsZC8Hs4",
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.appspot.com",
  messagingSenderId: "277123240771",
  appId: "1:277123240771:web:3802e33f088dc2dd563191"
};

// Initialize Firebase app (always needed)
export const initializeFirebase = async () => {
  if (!app) {
    const { initializeApp } = await import('firebase/app');
    app = initializeApp(firebaseConfig);
  }
  return app;
};

// Auth methods
export const getAuth = async () => {
  if (!auth) {
    await initializeFirebase();
    const { getAuth: getFirebaseAuth } = await import('firebase/auth');
    auth = getFirebaseAuth(app);
  }
  return auth;
};

export const signInWithEmailAndPassword = async (email, password) => {
  const authInstance = await getAuth();
  const { signInWithEmailAndPassword: signIn } = await import('firebase/auth');
  return signIn(authInstance, email, password);
};

export const createUserWithEmailAndPassword = async (email, password) => {
  const authInstance = await getAuth();
  const { createUserWithEmailAndPassword: createUser } = await import('firebase/auth');
  return createUser(authInstance, email, password);
};

export const signOut = async () => {
  const authInstance = await getAuth();
  const { signOut: firebaseSignOut } = await import('firebase/auth');
  return firebaseSignOut(authInstance);
};

export const onAuthStateChanged = async (callback) => {
  const authInstance = await getAuth();
  const { onAuthStateChanged: authStateChanged } = await import('firebase/auth');
  return authStateChanged(authInstance, callback);
};

// Firestore methods
export const getFirestore = async () => {
  if (!db) {
    await initializeFirebase();
    const { getFirestore: getFirestoreInstance } = await import('firebase/firestore');
    db = getFirestoreInstance(app);
  }
  return db;
};

export const getDoc = async (docRef) => {
  const { getDoc: firestoreGetDoc } = await import('firebase/firestore');
  return firestoreGetDoc(docRef);
};

export const setDoc = async (docRef, data, options) => {
  const { setDoc: firestoreSetDoc } = await import('firebase/firestore');
  return firestoreSetDoc(docRef, data, options);
};

export const doc = async (database, ...pathSegments) => {
  const { doc: firestoreDoc } = await import('firebase/firestore');
  return firestoreDoc(database, ...pathSegments);
};

export const collection = async (database, ...pathSegments) => {
  const { collection: firestoreCollection } = await import('firebase/firestore');
  return firestoreCollection(database, ...pathSegments);
};

export const query = async (...args) => {
  const { query: firestoreQuery } = await import('firebase/firestore');
  return firestoreQuery(...args);
};

export const where = async (...args) => {
  const { where: firestoreWhere } = await import('firebase/firestore');
  return firestoreWhere(...args);
};

export const orderBy = async (...args) => {
  const { orderBy: firestoreOrderBy } = await import('firebase/firestore');
  return firestoreOrderBy(...args);
};

export const limit = async (n) => {
  const { limit: firestoreLimit } = await import('firebase/firestore');
  return firestoreLimit(n);
};

export const getDocs = async (query) => {
  const { getDocs: firestoreGetDocs } = await import('firebase/firestore');
  return firestoreGetDocs(query);
};

export const serverTimestamp = async () => {
  const { serverTimestamp: firestoreServerTimestamp } = await import('firebase/firestore');
  return firestoreServerTimestamp();
};

// Storage methods
export const getStorage = async () => {
  if (!storage) {
    await initializeFirebase();
    const { getStorage: getStorageInstance } = await import('firebase/storage');
    storage = getStorageInstance(app);
  }
  return storage;
};

// Functions methods
export const getFunctions = async () => {
  if (!functions) {
    await initializeFirebase();
    const { getFunctions: getFunctionsInstance } = await import('firebase/functions');
    functions = getFunctionsInstance(app, 'us-central1');
  }
  return functions;
};

export const httpsCallable = async (functionsInstance, name) => {
  const { httpsCallable: callableFunction } = await import('firebase/functions');
  return callableFunction(functionsInstance, name);
};