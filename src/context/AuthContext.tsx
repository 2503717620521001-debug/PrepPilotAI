import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  FirebaseUser,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';
import { UserProfile, CareerRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateStudentProfile: (updates: Partial<UserProfile>) => Promise<void>;
  continueAsGuest: (sampleRole?: CareerRole) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest-student-1',
  email: 'student@example.edu',
  displayName: 'Alex Chen',
  college: 'National Institute of Engineering',
  degree: 'B.Tech',
  branch: 'Computer Science and Engineering',
  yearOfStudy: 'Final Year (4th)',
  targetCareer: 'Software Developer',
  preferredLanguage: 'Python',
  prepLevel: 'Intermediate',
  weakSubjects: ['Dynamic Programming', 'Graph Theory', 'Primary Clustering'],
  dailyStudyTimeMinutes: 90,
  targetDurationDays: 30,
  isOnboarded: true,
  currentStreak: 4,
  totalStudyMinutes: 360,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Load guest profile from localStorage if existing
  useEffect(() => {
    const savedGuest = localStorage.getItem('preppilot-guest-profile');
    if (savedGuest) {
      try {
        const parsed = JSON.parse(savedGuest);
        setProfile(parsed);
        setIsGuest(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      try {
        if (user) {
          setIsGuest(false);
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // First time login - initialize persistent Firestore profile
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'PrepPilot Student',
              targetCareer: 'Software Developer',
              preferredLanguage: 'Python',
              prepLevel: 'Intermediate',
              weakSubjects: [],
              dailyStudyTimeMinutes: 60,
              targetDurationDays: 30,
              isOnboarded: false,
              currentStreak: 1,
              totalStudyMinutes: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } else if (!isGuest) {
          const savedGuest = localStorage.getItem('preppilot-guest-profile');
          if (savedGuest) {
            setProfile(JSON.parse(savedGuest));
            setIsGuest(true);
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        console.warn('Firestore user fetch failed:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isGuest]);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setCurrentUser(res.user);
      setIsGuest(false);
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    setCurrentUser(res.user);
    setIsGuest(false);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    setIsGuest(false);
    setCurrentUser(res.user);

    // Send email verification link
    try {
      await sendEmailVerification(res.user);
    } catch (e) {
      console.warn('Could not auto-send verification email:', e);
    }

    const newProfile: UserProfile = {
      uid: res.user.uid,
      email: res.user.email || email,
      displayName: name,
      targetCareer: 'Software Developer',
      preferredLanguage: 'Python',
      prepLevel: 'Intermediate',
      weakSubjects: [],
      dailyStudyTimeMinutes: 60,
      targetDurationDays: 30,
      isOnboarded: false,
      currentStreak: 1,
      totalStudyMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${res.user.uid}`);
    }
    setProfile(newProfile);
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No user currently signed in.');
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setCurrentUser({ ...auth.currentUser });
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    localStorage.removeItem('preppilot-guest-profile');
    setIsGuest(false);
    setProfile(null);
    setCurrentUser(null);
    await signOut(auth);
  };

  const updateStudentProfile = async (updates: Partial<UserProfile>) => {
    const updated = {
      ...(profile || DEFAULT_PROFILE),
      ...updates,
      updatedAt: new Date().toISOString()
    };

    setProfile(updated as UserProfile);

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
      } catch (err) {
        console.error('Failed to update student profile in Firestore:', err);
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    } else {
      localStorage.setItem('preppilot-guest-profile', JSON.stringify(updated));
    }
  };

  const continueAsGuest = (sampleRole: CareerRole = 'Software Developer') => {
    const guestUser: UserProfile = {
      ...DEFAULT_PROFILE,
      targetCareer: sampleRole,
      displayName: 'Demo Student',
      isOnboarded: true
    };
    setIsGuest(true);
    setProfile(guestUser);
    localStorage.setItem('preppilot-guest-profile', JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        isGuest,
        signInWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        sendVerificationEmail,
        reloadUser,
        logout,
        updateStudentProfile,
        continueAsGuest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
