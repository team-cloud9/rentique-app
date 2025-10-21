// @Made By: Gurpreet Singh
import { auth, storage } from "../services/firebase-init.js";
import { authService } from "../services/AuthService.js";
import { profileService } from "../services/ProfileService.js";
import { modalService } from "../services/ModalService.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupBusinessForm");
    if (!form) {
        console.warn("[signup-business.js] - 'signupBusinessForm' not found on this page. Script will not execute.");
        return;
    }

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const policyCheckbox = document.getElementById("policyAccept");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const submitButton = form.querySelector('button[type="submit"]');

    const brandInfoModal = document.getElementById("brandInfoModal");
    const brandLogoInput = document.getElementById("brandLogo");
    const brandLogoPreview = document.getElementById("brandLogoPreview");
    const removeBrandLogoBtn = document.getElementById("removeBrandLogo");
    const photoPlaceholder = document.querySelector(".photo-placeholder");
    const brandNameInput = document.getElementById("brandName");
    const brandAddressInput = document.getElementById("brandAddress");
    const completeBrandInfoBtn = document.getElementById("completeBrandInfo");
    let uploadedBrandLogoFile = null;

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validatePassword(password) {
        return password.length >= 8;
    }

    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            if (!emailInput.value) {
                if (emailError) emailError.textContent = "Email is required";
                emailInput.classList.add("error");
            } else if (!validateEmail(emailInput.value)) {
                if (emailError) emailError.textContent = "Please enter a valid email";
                emailInput.classList.add("error");
            }
        });
        emailInput.addEventListener("input", () => {
            if (emailError) emailError.textContent = "";
            emailInput.classList.remove("error");
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("blur", () => {
            if (!passwordInput.value) {
                if (passwordError) passwordError.textContent = "Password is required";
                passwordInput.classList.add("error");
            } else if (!validatePassword(passwordInput.value)) {
                if (passwordError) passwordError.textContent = "Password must be at least 8 characters";
                passwordInput.classList.add("error");
            }
        });
        passwordInput.addEventListener("input", () => {
            if (passwordError) passwordError.textContent = "";
            passwordInput.classList.remove("error");
        });
    }

    if (policyCheckbox) {
        submitButton.disabled = !policyCheckbox.checked;
        policyCheckbox.addEventListener("change", () => {
            submitButton.disabled = !policyCheckbox.checked;
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        
        let isValid = true;
        if (!validateEmail(email)) {
            isValid = false;
            if(emailError) emailError.textContent = "Please enter a valid email";
        }
        if (!validatePassword(password)) {
            isValid = false;
            if(passwordError) passwordError.textContent = "Password must be at least 8 characters";
        }
        if (!isValid) return;

        submitButton.disabled = true;
        submitButton.textContent = "PROCESSING...";

        try {
            console.log("[signup-business.js] - Attempting to create new business user.");
            await authService.signUp(email, password, "business");

            console.log("[signup-business.js] - New user created. Showing brand info modal.");
            document.querySelector(".left").style.display = "none";
            brandInfoModal.style.display = "flex";

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                const profile = await profileService.getProfileByEmail(email);

                if (profile && profile.roles && profile.roles.includes('business')) {
                    await modalService.showAlert('Already Registered', 'This email is already registered as a business. Please log in.');
                    if (emailError) emailError.textContent = 'This email is already registered. Please log in.';
                } else {
                    const existingPassword = await modalService.showPrompt(
                        'Account Exists',
                        'This email is registered as a customer. To add a business profile, please enter your password to confirm.',
                        'Enter your password'
                    );

                    if (existingPassword) { 
                        try {
                            const userCredential = await authService.signIn(email, existingPassword);
                            await authService.addRoleToExistingUser(userCredential.user.uid, "business");
                            
                            await modalService.showAlert('Success!', 'Business role added. Please complete your brand information.');
                            document.querySelector(".left").style.display = "none";
                            brandInfoModal.style.display = "flex";
                        } catch (signInError) {
                            console.error("[signup-business.js] - Password verification failed.", signInError);
                            await modalService.showAlert('Verification Failed', 'The password you entered was incorrect. Please try the sign-up process again.');
                            if(emailError) emailError.textContent = "Password verification failed.";
                        }
                    } else { 
                        console.log('User cancelled password prompt.');
                        if(emailError) emailError.textContent = "Sign-up cancelled.";
                    }
                }
            } else {
                console.error("[signup-business.js] - An unexpected sign up error occurred:", error);
                await modalService.showAlert('Sign-Up Failed', error.message);
            }

            submitButton.disabled = !policyCheckbox.checked;
            submitButton.textContent = "CREATE ACCOUNT";
        }
    });

    if (brandLogoInput) {
        brandLogoInput.addEventListener("change", (e) => {
            uploadedBrandLogoFile = e.target.files[0];
            if (uploadedBrandLogoFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    brandLogoPreview.src = e.target.result;
                    brandLogoPreview.style.display = "block";
                    removeBrandLogoBtn.style.display = "block";
                    if(photoPlaceholder) photoPlaceholder.style.display = "none";
                };
                reader.readAsDataURL(uploadedBrandLogoFile);
            }
            checkBrandInfoCompletion();
        });
    }

    if (removeBrandLogoBtn) {
        removeBrandLogoBtn.addEventListener("click", () => {
            uploadedBrandLogoFile = null;
            brandLogoInput.value = "";
            brandLogoPreview.style.display = "none";
            brandLogoPreview.src = "";
            removeBrandLogoBtn.style.display = "none";
            if (photoPlaceholder) photoPlaceholder.style.display = "flex";
            checkBrandInfoCompletion();
        });
    }

    function checkBrandInfoCompletion() {
        if (completeBrandInfoBtn) {
            const hasLogo = uploadedBrandLogoFile !== null;
            const hasBrandName = brandNameInput.value.trim() !== "";
            const hasAddress = brandAddressInput.value.trim() !== "";
            completeBrandInfoBtn.disabled = !(hasLogo && hasBrandName && hasAddress);
        }
    }
    if (brandNameInput) brandNameInput.addEventListener("input", checkBrandInfoCompletion);
    if (brandAddressInput) brandAddressInput.addEventListener("input", checkBrandInfoCompletion);

    if (completeBrandInfoBtn) {
        completeBrandInfoBtn.addEventListener("click", async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                await modalService.showAlert('Error', 'No user is signed in. Please refresh and try again.');
                return;
            }

            completeBrandInfoBtn.disabled = true;
            completeBrandInfoBtn.textContent = "SAVING...";

            try {
                let brandLogoUrl = null;
                if (uploadedBrandLogoFile) {
                    console.log("[signup-business.js] - Uploading brand logo...");
                    const storageRef = ref(storage, `brand_logos/${currentUser.uid}/${uploadedBrandLogoFile.name}`);
                    const snapshot = await uploadBytes(storageRef, uploadedBrandLogoFile);
                    brandLogoUrl = await getDownloadURL(snapshot.ref);
                    console.log("[signup-business.js] - Logo uploaded successfully.");
                }

                const businessData = {
                    businessName: brandNameInput.value,
                    brandImageUrl: brandLogoUrl,
                    location: brandAddressInput.value
                };

                console.log("[signup-business.js] - Calling ProfileService.createBusiness.");
                await profileService.createBusiness(currentUser.uid, businessData);

                await profileService.updateProfile(currentUser.uid, {
                    displayName: businessData.businessName,
                    location: businessData.location
                });

                console.log("[signup-business.js] - Brand information saved.");
                window.location.href = "./success.html";

            } catch (error) {
                console.error("[signup-business.js] - Failed to save brand info:", error);
                await modalService.showAlert('Save Failed', error.message);
                completeBrandInfoBtn.disabled = false;
                completeBrandInfoBtn.textContent = "DONE";
            }
        });
    }
});