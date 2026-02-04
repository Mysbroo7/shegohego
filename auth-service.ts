import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase-service';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  followers?: number;
  following?: number;
  createdAt?: Date;
}

export const authService = {
  // Register new user
  async register(email: string, password: string, displayName: string): Promise<User> {
    const auth = getFirebaseAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });
    
    return userCredential.user;
  },

  // Login user
  async login(email: string, password: string): Promise<User> {
    const auth = getFirebaseAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Logout user
  async logout(): Promise<void> {
    const auth = getFirebaseAuth();
    await signOut(auth);
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  },

  // Get current user
  getCurrentUser(): User | null {
    const auth = getFirebaseAuth();
    return auth.currentUser;
  },

  // Update user profile
  async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    
    if (user) {
      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL,
      });
    }
  },

  // Convert Firebase user to UserProfile
  convertToUserProfile(user: User): UserProfile {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL || undefined,
    };
  },
};
