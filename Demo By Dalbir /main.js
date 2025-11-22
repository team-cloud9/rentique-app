const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const formTitle = document.getElementById("formTitle");
const msg = document.getElementById("message");

document.getElementById("showLogin").addEventListener("click", () => {
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  formTitle.textContent = "Login";
  msg.textContent = "";
});

document.getElementById("showSignup").addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
  formTitle.textContent = "Signup";
  msg.textContent = "";
});


signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("signupUser").value;
  const pass = document.getElementById("signupPass").value;

  localStorage.setItem("username", user);
  localStorage.setItem("password", pass);

  msg.style.color = "green";
  msg.textContent = "Signup successful! Please login.";
  signupForm.reset();
});


loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  const storedUser = localStorage.getItem("username");
  const storedPass = localStorage.getItem("password");

  if (user === storedUser && pass === storedPass) {
    msg.style.color = "green";
    msg.textContent = "Login successful! 🎉";
    loginForm.reset();
  } else {
    msg.style.color = "red";
    msg.textContent = "Invalid username or password.";
  }
});