// @Made By: Dalbir Singh
import { authService } from '../services/AuthService.js';
import { profileService } from '../services/ProfileService.js';
import { modalService } from '../services/ModalService.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    console.warn("[login.js] - 'loginForm' not found on this page. Script will not execute.");
    return;
  }

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  emailInput.addEventListener("blur", () => {
    if (!emailInput.value) {
      emailError.textContent = "Email is required";
      emailInput.classList.add("error");
    } else if (!validateEmail(emailInput.value)) {
      emailError.textContent = "Please enter a valid email";
      emailInput.classList.add("error");
    }
  });

  passwordInput.addEventListener("blur", () => {
    if (!passwordInput.value) {
      passwordError.textContent = "Password is required";
      passwordInput.classList.add("error");
    }
  });


  emailInput.addEventListener("input", () => {
    if (emailError.textContent) {
      emailError.textContent = "";
      emailInput.classList.remove("error");
    }
  });

  passwordInput.addEventListener("input", () => {
    if (passwordError.textContent) {
      passwordError.textContent = "";
      passwordInput.classList.remove("error");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    

    emailError.textContent = "";
    passwordError.textContent = "";
    
    let isValid = true;
    if (!email || !validateEmail(email)) {
      isValid = false;
      emailError.textContent = "Please enter a valid email";
      emailInput.classList.add("error");
    }
    if (!password) {
      isValid = false;
      passwordError.textContent = "Password is required";
      passwordInput.classList.add("error");
    }
    if (!isValid) return;

    const submitButton = form.querySelector('button[type="submit"]');
    
    try {
      submitButton.disabled = true;
      submitButton.textContent = "LOGGING IN...";

      console.log("[auth-login.js] - Calling AuthService.signIn.");
      const userCredential = await authService.signIn(email, password);
      const user = userCredential.user;

      console.log(`[auth-login.js] - User ${user.uid} signed in. Checking role...`);
      const profile = await profileService.getProfile(user.uid);

      if (window.location.pathname.includes('auth-login-business.html')) {
        if (profile && profile.roles && profile.roles.includes('business')) {
          console.log("[auth-login.js] - Business user confirmed. Redirecting to business dashboard.");
          window.location.href = '/view/business-side/pages/b-home.html'; 
        } else {
          throw { code: "auth/invalid-role" }; 
        }
      } else { 
        if (profile && profile.roles && profile.roles.includes('customer')) {
          console.log("[auth-login.js] - Customer user confirmed. Redirecting to customer home.");
          window.location.href = '../../home-business/index.html'; //modify krna later on
        } else {
          throw { code: "auth/invalid-role" };
        }
      }

    } catch (error) {
      console.error("[auth-login.js] - Login failed:", error);
      let errorMessage = "An unknown error occurred. Please try again later.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address.";
          break;
        case 'auth/wrong-password':
          errorMessage =  `Incorrect password. Please try again.`;
          break;
        case 'auth/invalid-login-credentials':
          errorMessage =  `Incorrect credentials. Please try again.`;
          break;
        case 'auth/invalid-role':
          errorMessage = "This account does not have permission to log in here.";
          break;
      }

      await modalService.showAlert('Login Failed', errorMessage);
      
      submitButton.disabled = false;
      submitButton.textContent = "LOG IN";
    }
  });
});