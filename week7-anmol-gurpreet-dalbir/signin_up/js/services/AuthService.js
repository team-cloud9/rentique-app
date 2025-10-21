// @Made By: Anmol Singh
import { auth, firestore } from './firebase-init.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

class AuthService {
    async signUp(email, password, initialRole) {
        console.log(`[AuthService] - Signing up user with initial role: ${initialRole}`);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const profileRef = doc(firestore, 'profiles', user.uid);
        await setDoc(profileRef, {
            email: user.email,
            roles: [initialRole], // Use an array for roles
            createdAt: serverTimestamp()
        });
        
        console.log(`[AuthService] - User & profile created successfully for UID: ${user.uid}`);
        return userCredential;
    }

    async addRoleToExistingUser(userId, newRole) {
        console.log(`[AuthService] - Adding role '${newRole}' to user UID: ${userId}`);
        const profileRef = doc(firestore, 'profiles', userId);
        

        await updateDoc(profileRef, {
            roles: arrayUnion(newRole)
        });

        console.log(`[AuthService] - Role added successfully.`);
    }

    async signIn(email, password) {
        console.log('[AuthService] - Attempting to sign in user.');
        return await signInWithEmailAndPassword(auth, email, password);
    }

    async sendPasswordReset(email) {
        console.log(`[AuthService] - Sending password reset to: ${email}`);
        return await sendPasswordResetEmail(auth, email);
    }
}

export const authService = new AuthService();