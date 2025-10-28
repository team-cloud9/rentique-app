document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".profile-btn");
  const contentArea = document.getElementById("profile-content");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const section = btn.dataset.section;

      // Hide main buttons
      buttons.forEach((b) => (b.style.display = "none"));

      try {
        const res = await fetch(`../components/view/sections/${section}.html`);
        if (!res.ok) throw new Error("Failed to load section");
        const html = await res.text();
        contentArea.innerHTML = html;

        // Back button
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
      }

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

// All dynamic section buttons (
document.addEventListener("click", (e) => {
  // Delete Section
  if (e.target.classList.contains("delete-cancel")) {
    document.querySelector(".back-btn")?.click();
  }

  if (e.target.classList.contains("delete-confirm")) {
    alert(
      "Thank you for being part of Rentique.\nYour account will now be deleted."
    );
  }

  // Security Section
  if (e.target.classList.contains("signout-btn")) {
    e.preventDefault();
    alert("You have successfully signed out.");
  }

  if (e.target.classList.contains("update-btn")) {
    e.preventDefault();
    alert("Update complete! Your changes have been saved.");
  }
});
