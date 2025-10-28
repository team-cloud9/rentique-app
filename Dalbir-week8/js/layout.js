
(function () {
 
  const pathPrefix = window.location.pathname.includes("/pages/") ? "../" : "./";


  fetch(`${pathPrefix}components/header.html`)
    .then(res => res.text())
    .then(data => {
      const headerContainer = document.getElementById("header-placeholder");
      if (headerContainer) {
        headerContainer.innerHTML = data;

       
        const backBtn = headerContainer.querySelector(".icon-back")?.closest("a");
        if (backBtn) {
       
          backBtn.href = window.location.pathname.includes("/pages/")
            ? "../pages/brand-setting.html"
            : "pages/brand-setting.html";

         
          if (window.location.pathname.includes("brand-setting.html")) {
            backBtn.style.display = "none";
          }
        }
      }
    })
    .catch(err => console.error("Header load failed:", err));

 
  fetch(`${pathPrefix}components/footer.html`)
    .then(res => res.text())
    .then(data => {
      const footerContainer = document.getElementById("footer-placeholder");
      if (footerContainer) footerContainer.innerHTML = data;
    })
    .catch(err => console.error("Footer load failed:", err));
})();
