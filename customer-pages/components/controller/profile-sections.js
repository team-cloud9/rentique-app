document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".profile-btn");
  const contentArea = document.getElementById("profile-content");
  const mainContainer = document.querySelector(".profile-container");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const section = btn.dataset.section;

      //  Hide the buttons
      buttons.forEach((b) => (b.style.display = "none"));

      try {
        const res = await fetch(`../components/view/sections/${section}.html`);
        if (!res.ok) throw new Error("Failed to load section");
        const html = await res.text();
        contentArea.innerHTML = html;

        // Back
        const backBtn = document.createElement("button");
        backBtn.textContent = "←";
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
