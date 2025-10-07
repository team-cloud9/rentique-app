 const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();

      if (!email || !password) {
        alert(" Please fill all fields!");
        return;
      }

      
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);

      alert(" Account created successfully! You can now log in.");
      window.location.href = "login.html";
    });
  }

  
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const savedEmail = localStorage.getItem("userEmail");
      const savedPassword = localStorage.getItem("userPassword");

      console.log("Entered Email:", email);
      console.log("Saved Email:", savedEmail);
      console.log("Entered Password:", password);
      console.log("Saved Password:", savedPassword);

      
      if (!savedEmail || !savedPassword) {
        alert(" No account found. Please sign up first.");
        window.location.href = "signup.html";
        return;
      }

      
      if (email === savedEmail && password === savedPassword) {
        alert(" Congratulations! You are logged in successfully.");
        window.location.href = "welcome.html";
      } else {
        alert(" Invalid email or password. Try again!");
      }
    });
  }

