// Import the necessary Firebase services
import { auth, firestore } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, setDoc, addDoc, collection, getDocs, deleteDoc, serverTimestamp, GeoPoint } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// --- DOM Elements ---
const seedButtonEl = document.getElementById('seedButton');
const wipeButtonEl = document.getElementById('wipeButton');
const logOutputEl = document.getElementById('logOutput');

// --- Logger Function ---
// A simple helper to log messages to the screen and the console.
function log(message) {
    console.log(message);
    logOutputEl.textContent += message + '\n';
}

// --- Helper Functions for Seeding ---

/**
 * Creates a new user in Firebase Authentication and their corresponding profile in Firestore.
 */
async function createUserAndProfile(creds, profileData) {
    const userCredential = await createUserWithEmailAndPassword(auth, creds.email, creds.password);
    const userUID = userCredential.user.uid;

    const profileRef = doc(firestore, 'profiles', userUID);
    await setDoc(profileRef, {
        ...profileData,
        createdAt: serverTimestamp()
    });

    log(`-> User & Profile created for: ${creds.email}`);
    return userUID;
}

/**
 * Creates a new business profile in the 'businesses' collection.
 */
async function createBusinessProfile(businessOwnerUID) {
    const businessesRef = collection(firestore, 'businesses');
    const businessDocRef = await addDoc(businessesRef, {
        profileID: businessOwnerUID,
        businessName: 'Rentique Finds',
        location: new GeoPoint(43.6532, -79.3832),
        createdAt: serverTimestamp()
    });

    log('-> Business profile created successfully.');
    return businessDocRef;
}

/**
 * Creates a sample product in the 'products' collection.
 */
async function createSampleProduct(businessId, businessOwnerUID) {
    const productsRef = collection(firestore, 'products');
    const productDocRef = await addDoc(productsRef, {
        businessID: businessId,
        profileID: businessOwnerUID,
        businessName: 'Rentique Finds',
        itemName: 'Vintage Denim Jacket',
        description: 'A timeless piece for any wardrobe.',
        price: 45,
        images: ['https://example.com/jacket1.jpg'],
        category: 'Jackets',
        occasion: ['Meeting', 'Party'],
        styles: ['Vintage', 'Street Style'],
        colors: ['Blue', 'Denim'],
        sizes: ['M', 'L'],
        gender: 'Unisex',
        season: 'Autumn',
        measurementTableUrl: 'https://example.com/measurements.jpg',
        createdAt: serverTimestamp()
    });

    log('-> Sample product created successfully.');
    return productDocRef;
}

/**
 * Creates a sample chat thread and the first message within it.
 */
async function createSampleChat(customerUID, businessUID, productDocRef) {
    const chatsRef = collection(firestore, 'chats');
    const chatDocRef = await addDoc(chatsRef, {
        participantIDs: [customerUID, businessUID],
        lastMessageText: 'Hi, is this still available?',
        lastMessageTimestamp: serverTimestamp(),
        productContext: {
            productID: productDocRef.id,
            itemName: 'Vintage Denim Jacket',
            imageUrl: 'https://example.com/jacket1.jpg'
        }
    });

    const messagesRef = collection(chatDocRef, 'messages');
    await addDoc(messagesRef, {
        senderID: customerUID,
        text: 'Hi, is this still available?',
        timestamp: serverTimestamp()
    });

    log('-> Sample chat created successfully.');
}


// --- Main SEED Function ---
// This function orchestrates the entire seeding process by calling the helper functions in order.
async function handleSeedDatabase() {
    log('--- Starting Database Seed ---');
    seedButtonEl.disabled = true;
    wipeButtonEl.disabled = true;

    try {
        // Step 1: Define test user data
        const customerCreds = { email: 'customer@test.com', password: 'password123' };
        const customerProfileData = {
            email: customerCreds.email,
            role: 'customer',
            displayName: 'Test Customer',
            phoneNumber: '+14165551234',
            location: new GeoPoint(43.7001, -79.4163),
            personalization: {
                height: "5'7\"", weight: "140 lbs", gender: "Woman",
                favoriteStyles: ["Classic", "Vintage"], favoriteColors: ["Red", "Black"],
                stylesToTry: ["Retro", "Y2K"]
            }
        };

        const businessCreds = { email: 'business@test.com', password: 'password123' };
        const businessProfileData = {
            email: businessCreds.email,
            role: 'business',
            displayName: 'Test Business Owner',
            phoneNumber: '+14165559876'
        };

        // Step 2: Create the users and their profiles
        const customerUID = await createUserAndProfile(customerCreds, customerProfileData);
        const businessUID = await createUserAndProfile(businessCreds, businessProfileData);

        // Step 3: Sign in as the business user to perform actions as them
        log('Signing in as business user to create data...');
        await signInWithEmailAndPassword(auth, businessCreds.email, businessCreds.password);
        log('-> Signed in as business user.');

        // Step 4: Create the business-specific data
        const businessDocRef = await createBusinessProfile(businessUID);
        const productDocRef = await createSampleProduct(businessDocRef.id, businessUID);

        // Step 5: Create a chat between the two users
        await createSampleChat(customerUID, businessUID, productDocRef);

        log('\n--- Database Seed Complete! ---');

    } catch (error) {
        log('\n--- ERROR DURING SEED ---');
        log(error.message);
        console.error(error);
    } finally {
        seedButtonEl.disabled = false;
        wipeButtonEl.disabled = false;
    }
}


// --- Main WIPE Function ---
// This function orchestrates the entire wipe process.
async function handleWipeDatabase() {
    if (!confirm("DANGER: Are you sure you want to delete ALL data from Firestore? This cannot be undone.")) {
        log('Wipe cancelled by user.');
        return;
    }

    log('--- Starting Database Wipe ---');
    seedButtonEl.disabled = true;
    wipeButtonEl.disabled = true;

    try {
        const collectionsToDelete = ['chats', 'products', 'businesses', 'profiles'];
        for (const collectionName of collectionsToDelete) {
            await wipeCollection(collectionName);
        }

        log('\n--- NOTE: AUTH USERS ARE NOT DELETED BY THIS SCRIPT ---');
        log('Please delete test users from the Firebase Authentication console manually before re-seeding.');
        log('\n--- Database Wipe Complete! ---');

    } catch (error) {
        log('\n--- ERROR DURING WIPE ---');
        log(error.message);
        console.error(error);
    } finally {
        seedButtonEl.disabled = false;
        wipeButtonEl.disabled = false;
    }
}

/**
 * A helper function to delete all documents in a collection, including messages in chat subcollections.
 */
async function wipeCollection(collectionName) {
    log(`Querying collection: ${collectionName}...`);
    const collectionRef = collection(firestore, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        log(`-> Collection '${collectionName}' is already empty.`);
        return;
    }

    log(`-> Found ${snapshot.size} documents in '${collectionName}'. Preparing to delete...`);
    for (const docSnapshot of snapshot.docs) {
        if (collectionName === 'chats') {
            await wipeSubcollection(docSnapshot.ref, 'messages');
        }
        await deleteDoc(docSnapshot.ref);
        log(`   - Deleted document: ${docSnapshot.id}`);
    }
    log(`-> Collection '${collectionName}' has been wiped.`);
}

/**
 * A helper function to delete all documents in a subcollection.
 */
async function wipeSubcollection(parentDocRef, subcollectionName) {
    log(`   Deleting '${subcollectionName}' subcollection...`);
    const subcollectionRef = collection(parentDocRef, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);
    if (!snapshot.empty) {
        const deletePromises = [];
        snapshot.forEach(doc => {
            deletePromises.push(deleteDoc(doc.ref));
        });
        await Promise.all(deletePromises);
        log(`   -> Deleted ${snapshot.size} messages.`);
    }
}


// Attach the event listeners to the buttons
seedButtonEl.addEventListener('click', handleSeedDatabase);
wipeButtonEl.addEventListener('click', handleWipeDatabase);