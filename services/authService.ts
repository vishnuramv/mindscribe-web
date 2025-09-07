import { User } from '../types';

// This is a mock authentication service that simulates Firebase Auth.
// In a real application, you would replace this with actual Firebase SDK calls.
// For example:
// import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
//
// const firebaseConfig = { /* your firebase config */ };
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// Mock User data to simulate a logged-in user.
const mockUser: User = {
  uid: 'mock-user-uid-123',
  email: 'demo@mindscribe.io',
  displayName: 'Amsavarthan',
};

let currentUser: User | null = null;
let authStateListener: ((user: User | null) => void) | null = null;

const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const authService = {
  /**
   * Listens for authentication state changes.
   * In a real Firebase app, this would wrap `onAuthStateChanged`.
   */
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    // Check session storage to persist login state on page refresh for better DX
    if (!currentUser) {
        const sessionUserJson = sessionStorage.getItem('mindscribe_user');
        if (sessionUserJson) {
            currentUser = JSON.parse(sessionUserJson);
        }
    }

    authStateListener = callback;
    authStateListener(currentUser);

    // Return an unsubscribe function.
    return () => {
      authStateListener = null;
    };
  },

  /**
   * Signs in a user with email and password.
   * In a real Firebase app, this would wrap `signInWithEmailAndPassword`.
   */
  signInWithEmailAndPassword: async (email: string, pass:string): Promise<void> => {
    await networkDelay(1000); // Simulate network latency
    if (email === 'demo@mindscribe.io' && pass === 'password123') {
      currentUser = mockUser;
      sessionStorage.setItem('mindscribe_user', JSON.stringify(currentUser));
      if (authStateListener) {
        authStateListener(currentUser);
      }
    } else {
      throw new Error('Invalid email or password.');
    }
  },

  /**
   * Signs out the current user.
   * In a real Firebase app, this would wrap `signOut`.
   */
  signOut: async (): Promise<void> => {
    await networkDelay(500);
    currentUser = null;
    sessionStorage.removeItem('mindscribe_user');
    if (authStateListener) {
      authStateListener(null);
    }
  },
};

export { authService };
