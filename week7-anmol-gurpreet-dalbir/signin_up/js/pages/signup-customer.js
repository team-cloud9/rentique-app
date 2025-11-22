// @Made By: Gurpreet Singh
import { auth, storage } from "../services/firebase-init.js";
import { authService } from "../services/AuthService.js";
import { profileService } from "../services/ProfileService.js";
import { modalService } from "../services/ModalService.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) { 
        console.warn("[signup-customer.js] - 'signupForm' not found. Script will not run.");
        return; 
    }
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const policyCheckbox = document.getElementById("policyAccept");
    const generalError = document.getElementById("generalError");
    const submitButton = signupForm.querySelector('button[type="submit"]');

    const userProfileModal = document.getElementById("userProfileModal");
    const usernameInput = document.getElementById("username");
    const addressInput = document.getElementById("address");
    const profilePhotoInput = document.getElementById("profilePhoto");
    const profilePreview = document.getElementById("profilePreview");
    const photoPlaceholder = userProfileModal.querySelector(".photo-placeholder");
    const continueToQuestionnaireBtn = document.getElementById("continueToQuestionnaire");
    let uploadedProfilePhotoFile = null;

    const questionnaireModal = document.getElementById("questionnaireModal");
    const questionnaireSteps = document.querySelectorAll(".questionnaire-step");
    const progressSteps = document.querySelectorAll(".progress-step");
    const continueButtons = document.querySelectorAll(".questionnaire-continue");
    const backButtons = document.querySelectorAll(".questionnaire-back");
    const doneButton = document.querySelector(".questionnaire-done");
    let currentStep = 1;

    function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function validatePassword(password) { return password.length >= 8; }

    if (policyCheckbox) {
        submitButton.disabled = !policyCheckbox.checked;
        policyCheckbox.addEventListener("change", () => { submitButton.disabled = !policyCheckbox.checked; });
    }

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (!validateEmail(email) || !validatePassword(password)) {
            if(generalError) generalError.textContent = "Please provide a valid email and a password of at least 8 characters.";
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "CREATING...";

        try {
            console.log("[signup-customer.js] - Calling AuthService.signUp for 'customer'.");
            await authService.signUp(email, password, 'customer');
            
            console.log("[signup-customer.js] - Sign-up successful. Showing profile modal.");
            document.querySelector(".left").style.display = "none";
            if (document.querySelector(".right")) {
                document.querySelector(".right").style.display = "none";
            }
            userProfileModal.style.display = "flex";

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                console.warn("[signup-customer.js] - Email already exists. Checking roles...");
                const profile = await profileService.getProfileByEmail(email);

                if (profile && profile.roles && profile.roles.includes('customer')) {
                    await modalService.showAlert('Already Registered', 'This email is already registered as a customer. Please log in.');
                    if (generalError) generalError.textContent = 'This email is already registered. Please log in.';
                
                } else if (profile && profile.roles && profile.roles.includes('business')) {
                     await modalService.showAlert(
                        'Business Account Found', 
                        'This email is registered as a business. You can use the same account to log in as a customer.'
                    );
                     window.location.href = './success.html';
                }
            } else {
                console.error("[signup-customer.js] - Sign up failed:", error);
                if(generalError) generalError.textContent = error.message;
            }

            submitButton.disabled = !policyCheckbox.checked;
            submitButton.textContent = "CREATE ACCOUNT";
        }
    });

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener("change", (e) => {
            uploadedProfilePhotoFile = e.target.files[0];
            if (uploadedProfilePhotoFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePreview.src = e.target.result;
                    profilePreview.style.display = "block";
                    if(photoPlaceholder) photoPlaceholder.style.display = "none";
                };
                reader.readAsDataURL(uploadedProfilePhotoFile);
            }
            checkProfileCompletion();
        });
    }

    function checkProfileCompletion() {
        if(continueToQuestionnaireBtn){
            continueToQuestionnaireBtn.disabled = !(usernameInput.value.trim() && addressInput.value.trim());
        }
    }
    if(usernameInput) usernameInput.addEventListener("input", checkProfileCompletion);
    if(addressInput) addressInput.addEventListener("input", checkProfileCompletion);

    if (continueToQuestionnaireBtn) {
        continueToQuestionnaireBtn.addEventListener("click", async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) { return modalService.showAlert('Error', 'No user is signed in.'); }

            continueToQuestionnaireBtn.disabled = true;
            continueToQuestionnaireBtn.textContent = "SAVING...";

            try {
                let profilePhotoUrl = null;
                if (uploadedProfilePhotoFile) {
                    const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${uploadedProfilePhotoFile.name}`);
                    const snapshot = await uploadBytes(storageRef, uploadedProfilePhotoFile);
                    profilePhotoUrl = await getDownloadURL(snapshot.ref);
                }

                const profileData = {
                    displayName: usernameInput.value,
                    location: addressInput.value,
                    profileImageUrl: profilePhotoUrl
                };

                await profileService.updateProfile(currentUser.uid, profileData);
                
                console.log("[signup-customer.js] - Profile info saved. Showing questionnaire modal.");
                userProfileModal.style.display = "none";
                questionnaireModal.style.display = "flex";

            } catch (error) {
                console.error("[signup-customer.js] - Failed to save profile info:", error);
                await modalService.showAlert('Save Failed', error.message);
                continueToQuestionnaireBtn.disabled = false;
                continueToQuestionnaireBtn.textContent = "Continue";
            }
        });
    }
    
    const questionnaireBackToProfile = document.querySelector('.questionnaire-back-to-profile');
    if (questionnaireBackToProfile) {
        questionnaireBackToProfile.addEventListener('click', (e) => {
            e.preventDefault();
            questionnaireModal.style.display = 'none';
            userProfileModal.style.display = 'flex';
        });
    }

    function showStep(stepNumber) {
        questionnaireSteps.forEach(step => {
            step.style.display = step.dataset.step == stepNumber ? 'block' : 'none';
        });
        progressSteps.forEach(step => {
            step.classList.toggle('active', step.dataset.step <= stepNumber);
        });
        currentStep = stepNumber;
    }

    continueButtons.forEach(button => {
        button.addEventListener('click', () => showStep(currentStep + 1));
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => showStep(currentStep - 1));
    });

    if (doneButton) {
        doneButton.addEventListener('click', async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) { return modalService.showAlert('Error', 'No user is signed in.'); }

            doneButton.disabled = true;
            doneButton.textContent = "SAVING...";

            try {
                const personalizationData = {
                    personalization: {
                        height: document.getElementById('height').value,
                        weight: document.getElementById('weight').value,
                        gender: document.querySelector('input[name="gender"]:checked')?.value,
                        favoriteColors: Array.from(document.querySelectorAll('input[name="favoriteColor"]:checked')).map(cb => cb.value),
                        favoriteStyles: Array.from(document.querySelectorAll('input[name="favoriteStyle"]:checked')).map(cb => cb.value),
                        stylesToTry: Array.from(document.querySelectorAll('input[name="styleToTry"]:checked')).map(cb => cb.value)
                    }
                };

                await profileService.updateProfile(currentUser.uid, personalizationData);
                console.log("[signup-customer.js] - Questionnaire saved. Redirecting to success.");
                window.location.href = "success.html";

            } catch (error) {
                console.error("[signup-customer.js] - Failed to save questionnaire:", error);
                await modalService.showAlert('Save Failed', error.message);
                doneButton.disabled = false;
                doneButton.textContent = "DONE";
            }
        });
    }
});
