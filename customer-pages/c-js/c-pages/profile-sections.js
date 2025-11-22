document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".profile-btn");
  const contentArea = document.getElementById("profile-content");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const section = btn.dataset.section;

      // Hide main buttons
      buttons.forEach((b) => (b.style.display = "none"));

      try {
        // Load the HTML section dynamically
        const res = await fetch(`./sections/${section}.html`);
        if (!res.ok) throw new Error("Failed to load section");
        const html = await res.text();

        // Inject HTML into content area
        contentArea.innerHTML = html;

        // Run any <script> tags included inside the fetched HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const scriptTags = tempDiv.querySelectorAll("script");
        scriptTags.forEach((oldScript) => {
          const newScript = document.createElement("script");
          if (oldScript.src) {
            newScript.src = oldScript.src;
            newScript.type = oldScript.type || "text/javascript";
          } else {
            newScript.textContent = oldScript.textContent;
          }
          document.body.appendChild(newScript);
        });

        // Create and add back button
        const backBtn = document.createElement("button");
        backBtn.textContent = "<";
        backBtn.classList.add("back-btn");
        backBtn.addEventListener("click", () => {
          contentArea.innerHTML = "";
          buttons.forEach((b) => (b.style.display = "block"));
          backBtn.remove();
        });
        contentArea.prepend(backBtn);
      } catch (err) {
        contentArea.innerHTML = `<p style="color:red;">Error loading section: ${section}</p>`;
        buttons.forEach((b) => (b.style.display = "block"));
        console.error(err);
      }

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

/* ------------------------------------------
   Popup Utility (Reusable for all pages)
------------------------------------------- */
function showPopup(message, isError = false) {
  let popup =
    document.getElementById("successPopup") ||
    document.querySelector(".popup-overlay") ||
    document.querySelector(".message-popup-overlay");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "successPopup";
    popup.className = "message-popup-overlay";
    popup.innerHTML = `
      <div class="message-popup-box">
        <h3 id="popupMessage"></h3>
        <button id="popupCloseBtn">OK</button>
      </div>
    `;
    document.body.appendChild(popup);
  }
  const messageEl =
    popup.querySelector("#popupMessage") ||
    popup.querySelector(".popup-content h3");
  const closeBtn =
    popup.querySelector("#popupCloseBtn") ||
    popup.querySelector(".popup-close") ||
    popup.querySelector("button");

  if (messageEl) {
    messageEl.textContent = message;
    messageEl.style.color = isError ? "crimson" : "var(--deep-teal-blue)";
  }

  popup.classList.add("active");
  popup.style.display = "flex";

  if (closeBtn) {
    closeBtn.onclick = () => {
      popup.classList.remove("active");
      popup.style.display = "none";
    };
  }

  setTimeout(() => {
    popup.classList.remove("active");
    popup.style.display = "none";
  }, 2500);
}
/* ------------------------------------------
   Global click listeners for dynamic elements
------------------------------------------- */
document.addEventListener("click", (e) => {
  // Cancel delete -> back to main buttons
  if (e.target.classList.contains("delete-cancel")) {
    document.querySelector(".back-btn")?.click();
  }

  // Confirm delete
  if (e.target.classList.contains("delete-confirm")) {
    showPopup(
      "Thank you for being part of Rentique. Your account will now be deleted."
    );
  }

  // Sign out
  if (e.target.classList.contains("signout-btn")) {
    e.preventDefault();
    showPopup("You have successfully signed out.");
  }
});
