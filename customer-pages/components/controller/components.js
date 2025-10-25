/**
 * Navigation Configuration for Customer and Business Sides
 *
 * This file contains all navigation links, icons, and logos for both user types.
 * Update the href values and icon paths as needed for your project.
 */

const NavigationConfig = {
  customer: {
    // Logo configuration
    logos: {
      main: "../assets/logo/rentique_blue_L.svg",
      sub: "../assets/logo/rentique_blue_S.svg",
      center: "../assets/logo/rentique_blue_S.svg",
      footerMain: "../assets/logo/rentique_blue_L.svg",
      footerSub: "../assets/logo/rentique_green_s.svg",
    },

    // Navigation links for header
    navLinks: [
      { text: "BROWSE", href: "./c-discover-page.html" },
      { text: "CHAT LIST", href: "#" },
      { text: "PROFILE", href: "#" },
    ],

    //codigo nuevo


    // Icons for mobile header
    icons: {
      search: "../assets/icon/Icon_search.svg",
      right1: "../assets/icon/Icon_chat.svg",
      right2: "../assets/icon/Icon_user.svg",
      scrollTop: "../assets/icon/Icon_back.svg",
    },

    // User greeting text
    userGreeting: "Hi, Chloe",

    // Footer configuration
    footer: {
      tagline: "Our boutique is for rent",
      links: [
        { text: "BROWSE", href: "./c-discover-page.html" },
        { text: "CHAT LIST", href: "#" },
        { text: "PROFILE", href: "#" },
      ],
    },

    // Home page link
    homeLink: "./c-home.html",
  },

  business: {
    // Logo configuration (using green logos for business side)
    logos: {
      main: "../assets/logo/rentique_blue_L.svg",
      sub: "../assets/logo/rentique_blue_S.svg",
      center: "../assets/logo/rentique_blue_S.svg",
      footerMain: "../assets/logo/rentique_blue_L.svg",
      footerSub: "../assets/logo/rentique_green_s.svg",
    },

    // Navigation links for header
    navLinks: [
      { text: "BROWSE", href: "./c-discover-page.html" },
      { text: "CHAT LIST", href: "#" },
      { text: "PROFILE", href: "#" },
    ],

    // Icons for mobile header
    icons: {
      search: "../assets/icon/Icon_search.svg",
      right1: "../assets/icon/Icon_chat.svg",
      right2: "../assets/icon/Icon_user.svg",
      scrollTop: "../assets/icon/Icon_back.svg",
    },

    // User greeting text
    userGreeting: "Hi, Chloe",

    // Footer configuration
    footer: {
      tagline: "Our boutique is for rent",
      links: [
        { text: "BROWSE", href: "./c-discover-page.html" },
        { text: "CHAT LIST", href: "#" },
        { text: "PROFILE", href: "#" },
      ],
    },

    // Home page link
    homeLink: "./c-home.html",
  },
}

/**
 * Initialize navigation based on user type
 * Call this function after the DOM is loaded
 */
function initializeNavigation() {
  // Find header and footer elements
  const header = document.querySelector("header[data-user-type]")
  const footer = document.querySelector("footer[data-user-type]")

  if (!header && !footer) {
    console.warn("No header or footer with data-user-type attribute found")
    return
  }

  // Get user type from header or footer
  const userType = header?.getAttribute("data-user-type") || footer?.getAttribute("data-user-type") || "customer"
  const config = NavigationConfig[userType]

  if (!config) {
    console.error(`Invalid user type: ${userType}`)
    return
  }

  // Initialize header
  if (header) {
    initializeHeader(header, config)
  }

  // Initialize footer
  if (footer) {
    initializeFooter(footer, config)
  }
}

/**
 * Initialize header with configuration
 */
function initializeHeader(header, config) {
  // Set logos
  const logoMain = header.querySelector('[data-logo="main"]')
  const logoSub = header.querySelector('[data-logo="sub"]')
  const logoCenter = header.querySelector('[data-logo="center"]')

  if (logoMain) {
    logoMain.src = config.logos.main
    logoMain.alt = "Main Logo"
  }
  if (logoSub) {
    logoSub.src = config.logos.sub
    logoSub.alt = "RENTIQUE"
  }
  if (logoCenter) {
    logoCenter.src = config.logos.center
    logoCenter.alt = "Rentique Logo"
  }

  // Set home link
  const homeLinks = header.querySelectorAll('[data-nav="home"]')
  homeLinks.forEach((link) => {
    link.href = config.homeLink
  })

  // Set navigation links
  const navLinksContainer = header.querySelector("[data-nav-links]")
  if (navLinksContainer) {
    navLinksContainer.innerHTML = ""
    config.navLinks.forEach((link) => {
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.href = link.href
      a.textContent = link.text
      li.appendChild(a)
      navLinksContainer.appendChild(li)

    })
  }

  // Set user greeting
  const userGreeting = header.querySelector("[data-user-greeting]")
  if (userGreeting) {
    userGreeting.textContent = config.userGreeting
  }

  // Set mobile icons
  const searchIcon = header.querySelector('[data-icon="search"]')
  const rightIcon1 = header.querySelector('[data-icon="right-1"]')
  const rightIcon2 = header.querySelector('[data-icon="right-2"]')

  if (searchIcon) {
    searchIcon.src = config.icons.search
    searchIcon.alt = "Search"
  }
  if (rightIcon1) {
    rightIcon1.src = config.icons.right1
    rightIcon1.alt = config.navLinks[1]?.text || "Icon"
  }
  if (rightIcon2) {
    rightIcon2.src = config.icons.right2
    rightIcon2.alt = config.navLinks[2]?.text || "Icon"
  }
}

/**
 * Initialize footer with configuration
 */
function initializeFooter(footer, config) {
  // Set logos
  const footerLogoMain = footer.querySelector('[data-logo="footer-main"]')
  const footerLogoSub = footer.querySelector('[data-logo="footer-sub"]')

  if (footerLogoMain) {
    footerLogoMain.src = config.logos.footerMain
    footerLogoMain.alt = "Footer Logo"
  }
  if (footerLogoSub) {
    footerLogoSub.src = config.logos.footerSub
    footerLogoSub.alt = "RENTIQUE"
  }

  // Set home link
  const homeLinks = footer.querySelectorAll('[data-nav="home"]')
  homeLinks.forEach((link) => {
    link.href = config.homeLink
  })

  // Set tagline
  const tagline = footer.querySelector("[data-footer-tagline]")
  if (tagline) {
    tagline.textContent = config.footer.tagline
  }

  // Set footer links
  const footerLinksContainer = footer.querySelector("[data-footer-links]")
  if (footerLinksContainer) {
    footerLinksContainer.innerHTML = ""
    config.footer.links.forEach((link) => {
      const div = document.createElement("div")
      const h3 = document.createElement("h3")
      const a = document.createElement("a")
      a.href = link.href
      a.textContent = link.text
      h3.appendChild(a)
      div.appendChild(h3)
      footerLinksContainer.appendChild(div)
    })
  }

  // Set scroll to top icon
  const scrollTopIcon = footer.querySelector('[data-icon="scroll-top"]')
  if (scrollTopIcon) {
    scrollTopIcon.src = config.icons.scrollTop
    scrollTopIcon.alt = "Go to top"
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeNavigation)
} else {
  initializeNavigation()
}

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { NavigationConfig, initializeNavigation }
}
