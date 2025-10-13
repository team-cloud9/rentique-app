
// UI + FORM HANDLING SCRIPT

import { signUpUser, loginUser, saveUserProfile, saveQuestionnaire } from "./firebase.js";


// SIGNUP PAGE

const signupForm = document.querySelector(".login-form");
if (signupForm && signupForm.querySelector("h2")?.textContent.includes("Create")) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value.trim();
    const password = signupForm.querySelectorAll('input[type="password"]')[0].value.trim();
    const confirm = signupForm.querySelectorAll('input[type="password"]')[1].value.trim();

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    signUpUser(email, password);
  });
}


// LOGIN PAGE

const loginForm = document.querySelector(".login-form");
if (loginForm && loginForm.querySelector("h2")?.textContent.includes("LOG IN")) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();
    loginUser(email, password);
  });
}


// PROFILE PAGE

const profileForm = document.querySelector("form[action='Questionnaire1.html']");
if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = profileForm.querySelectorAll('input[type="text"]')[0].value.trim();
    const address = profileForm.querySelectorAll('input[type="text"]')[1].value.trim();
    saveUserProfile(name, address);
  });
}

// QUESTIONNAIRE 1

const q1Form = document.querySelector("form[action='Questionnaire2.html']");
if (q1Form) {
  q1Form.addEventListener("submit", (e) => {
    e.preventDefault();
    const height = q1Form.querySelectorAll('input[type="text"]')[0].value.trim();
    const weight = q1Form.querySelectorAll('input[type="text"]')[1].value.trim();
    const gender = q1Form.querySelector('input[name="gender"]:checked')?.nextSibling.textContent.trim() || "";
    saveQuestionnaire({ height, weight, gender }, "Questionnaire2.html");
  });
}


// QUESTIONNAIRE 2

const q2Form = document.querySelector("form[action='Questionnaire3.html']");
if (q2Form) {
  q2Form.addEventListener("submit", (e) => {
    e.preventDefault();
    const colors = Array.from(q2Form.querySelectorAll('input[type="checkbox"]:checked')).map(
      (el) => el.id
    );
    saveQuestionnaire({ colors }, "Questionnaire3.html");
  });
}


// QUESTIONNAIRE 3

const q3Form = document.querySelector("form[action='done.html']");
if (q3Form) {
  q3Form.addEventListener("submit", (e) => {
    e.preventDefault();
    const styles = Array.from(q3Form.querySelectorAll('input[type="checkbox"]:checked')).map(
      (el) => el.id
    );
    saveQuestionnaire({ styles }, "done.html");
  });
}
