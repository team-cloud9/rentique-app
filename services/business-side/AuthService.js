import { auth, firestore } from "./firebase-init.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

class AuthService {
    async signUp(email, password, initialRole) {
        console.log(`[AuthService] - Attempting to sign up ${email} with role ${initialRole}`);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const profileRef = doc(firestore, 'profiles', user.uid);
        
        if (initialRole === "customer") {
            await setDoc(profileRef, {
                email: user.email,
                roles: [initialRole],
                createdAt: new Date(),
                displayName: '',
            });
        } else {
            await setDoc(profileRef, {
                email: user.email,
                roles: [initialRole],
                createdAt: new Date(),
            });
        }

        console.log(`[AuthService] - User ${user.uid} created successfully.`);
        return userCredential;
    }

    async signIn(email, password) {
        console.log(`[AuthService] - Attempting to sign in ${email}`);
        return await signInWithEmailAndPassword(auth, email, password);
    }

    async addRoleToExistingUser(uid, newRole) {
        console.log(`[AuthService] - Adding role '${newRole}' to user ${uid}`);
        const profileRef = doc(firestore, 'profiles', uid);
        await updateDoc(profileRef, {
            roles: arrayUnion(newRole)
        });
        console.log(`[AuthService] - Role added successfully.`);
    }
}

export const authService = new AuthService();