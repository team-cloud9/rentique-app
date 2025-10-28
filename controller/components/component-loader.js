// @Made By: Anmol Singh
(() => {
  const COMPONENT_PATHS = {
    header: "/view/components/pages/header.html",
    footer: "/view/components/pages/footer.html",
  };

  async function fetchHTML(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
      return await response.text();
    } catch (error) {
      console.error(`Error loading component from ${url}:`, error);
      return null;
    }
  }
  
  async function loadComponent(placeholder, componentPath) {
    if (!placeholder) return;
    const html = await fetchHTML(componentPath);
    if (html) {
      placeholder.innerHTML = html;
    }
  }

  async function initializeAllComponents() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");
    const userType = headerPlaceholder?.dataset.userType || footerPlaceholder?.dataset.userType;
    
    if (!userType) {
        return; 
    }
    await Promise.all([
      loadComponent(headerPlaceholder, COMPONENT_PATHS.header),
      loadComponent(footerPlaceholder, COMPONENT_PATHS.footer),
    ]); 
    if (typeof initializeNavigation === 'function') {
      initializeNavigation(userType);
    } else {
      console.error("Fatal Error: `components.js` must be loaded before `component-loader.js`.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAllComponents);
  } else {
    initializeAllComponents();
  }
})();