/**
 * Component Loader - Automatically loads header and footer HTML files
 *
 * Usage in your HTML pages:
 * 1. Add placeholder divs:
 *    <div id="header-placeholder" data-user-type="customer"></div>
 *    <div id="footer-placeholder" data-user-type="customer"></div>
 *
 * 2. Include this script and navigation-config.js:
 *    <script src="../components/component-loader.js"></script>
 *    <script src="../components/navigation-config.js"></script>
 *
 * The script will automatically load header.html and footer.html and inject them.
 */

;(() => {
  // Configuration for component paths
  const COMPONENT_PATHS = {
    header: "../components/view/pages/header.html",
    footer: "../components/view/pages/footer.html",
  }

  /**
   * Fetch HTML content from a file
   */
  async function fetchHTML(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      console.error(`Error loading component from ${url}:`, error)
      return null
    }
  }

  /**
   * Load header component
   */
  async function loadHeader() {
    const placeholder = document.getElementById("header-placeholder")
    if (!placeholder) return

    const userType = placeholder.getAttribute("data-user-type") || "customer"
    const html = await fetchHTML(COMPONENT_PATHS.header)

    if (html) {
      placeholder.innerHTML = html
      // Set the user type on the loaded header
      const header = placeholder.querySelector("header")
      if (header) {
        header.setAttribute("data-user-type", userType)
      }
    }
  }

  /**
   * Load footer component
   */
  async function loadFooter() {
    const placeholder = document.getElementById("footer-placeholder")
    if (!placeholder) return

    const userType = placeholder.getAttribute("data-user-type") || "customer"
    const html = await fetchHTML(COMPONENT_PATHS.footer)

    if (html) {
      placeholder.innerHTML = html
      // Set the user type on the loaded footer
      const footer = placeholder.querySelector("footer")
      if (footer) {
        footer.setAttribute("data-user-type", userType)
      }
    }
  }

  /**
   * Initialize all components
   */
  async function initializeComponents() {
    // Load header and footer in parallel
    await Promise.all([loadHeader(), loadFooter()])

    // After loading, initialize navigation if the function exists
    if (window.initializeNavigation) {
      window.initializeNavigation()
    } else {
      // If navigation-config.js hasn't loaded yet, wait for it
      const checkNavigation = setInterval(() => {
        if (window.initializeNavigation) {
          clearInterval(checkNavigation)
          window.initializeNavigation()
        }
      }, 100)

      // Stop checking after 5 seconds
      setTimeout(() => clearInterval(checkNavigation), 5000)
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeComponents)
  } else {
    initializeComponents()
  }

  // Export for manual initialization if needed
  window.RentiqueComponents = {
    loadHeader,
    loadFooter,
    initializeComponents,
  }
})()
