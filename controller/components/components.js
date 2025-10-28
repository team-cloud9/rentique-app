// @Made By: Anmol Singh
const NavigationConfig = {
  customer: {
    logos: {
      main: "/assets/logos/rentique_blue_L.svg",
      sub: "/assets/logos/rentique_blue_S.svg",
      center: "/assets/logos/rentique_blue_S.svg",
      footerMain: "/assets/logos/rentique_blue_L.svg",
      footerSub: "/assets/logos/rentique_green_S.svg",
    },
    navLinks: [
      { text: "BROWSE", href: "/views/customer-side/pages/c-discover-page.html" },
      { text: "CHAT LIST", href: "/views/customer-side/pages/chat-list.html" },
      { text: "PROFILE", href: "/views/customer-side/pages/profile.html" },
    ],
    icons: {
      search: "/assets/icons/Icon_search.svg",
      right1: "/assets/icons/Icon_chat.svg",
      right2: "/assets/icons/Icon_user.svg",
      scrollTop: "/assets/icons/Icon_back.svg",
    },
    userGreeting: "Hi, Chloe",
   
    footer: {
      tagline: "Our boutique is for rent.",
      links: [
        { text: "BROWSE", href: "/views/customer-side/pages/c-discover-page.html" },
        { text: "CHAT LIST", href: "/views/customer-side/pages/chat-list.html" },
        { text: "PROFILE", href: "/views/customer-side/pages/profile.html" },
      ],
    },
    
    homeLink: "/views/customer-side/pages/c-home.html",
  },
  business: {
    logos: {
      main: "/assets/logos/rentique_blue_L.svg",
      sub: "/assets/logos/rentique_blue_S.svg",
      center: "/assets/logos/rentique_blue_S.svg",
      footerMain: "/assets/logos/rentique_blue_L.svg",
      footerSub: "/assets/logos/rentique_green_S.svg",
    },
    navLinks: [
      { text: "BROWSE", href: "/views/business-side/pages/b-home.html" },
      { text: "CHAT LIST", href: "/views/business-side/pages/b-chat.html" },
      { text: "PROFILE", href: "/views/business-side/pages/b-profile.html" },
    ],
    icons: {
      search: "/assets/icons/Icon_search.svg",
      right1: "/assets/icons/Icon_chat.svg",
      right2: "/assets/icons/Icon_user.svg",
      scrollTop: "/assets/icons/Icon_back.svg",
    },
    userGreeting: "Hi, Chloe",
    
     footer: {
      tagline: "Our boutique is for rent.",
      links: [
        { text: "BROWSE", href: "/view/business-side/pages/b-home.html" },
        { text: "CHAT LIST", href: "/view/business-side/pages/b-chat.html" },
        { text: "PROFILE", href: "/view/business-side/pages/b-profile.html" },
      ],
    },
    
    homeLink: "/views/business-side/pages/home-business.html",
  },
};

function initializeNavigation(userType) {
  const header = document.querySelector("header"); 
  const footer = document.querySelector("footer");

  
  const config = NavigationConfig[userType];
  
  console.log('Final header element found:', header);
  console.log(`Using config for userType: "${userType}"`, config);
  if (!config) {
    console.error(`Invalid user type: ${userType}`);
    return;
  }

  if (header) populateHeader(header, config);
  if (footer) populateFooter(footer, config);
}

function populateHeader(header, config) {
  header.querySelectorAll('[data-nav="home"]').forEach(link => link.href = config.homeLink);
  header.querySelector('[data-logo="main"]').src = config.logos.main;
  header.querySelector('[data-logo="sub"]').src = config.logos.sub;
  header.querySelector('[data-logo="center"]').src = config.logos.center;
  const navLinksContainer = header.querySelector("[data-nav-links]");
  if (navLinksContainer) {
    navLinksContainer.innerHTML = config.navLinks.map(link => `<li><a href="${link.href}">${link.text}</a></li>`).join('');
  }
  header.querySelector("[data-user-greeting]").textContent = config.userGreeting;
  header.querySelector('[data-icon="search"]').src = config.icons.search;
  header.querySelector('[data-icon="right-1"]').src = config.icons.right1;
  header.querySelector('[data-icon="right-2"]').src = config.icons.right2;
}

function populateFooter(footer, config) {
  footer.querySelectorAll('[data-nav="home"]').forEach(link => link.href = config.homeLink);
  // footer.querySelector('[data-logo="footer-main"]').src = config.logos.footerMain;
  footer.querySelector('[data-logo="footer-sub"]').src = config.logos.footerSub;
  footer.querySelector("[data-footer-tagline]").textContent = config.footer.tagline;
  
  const footerLinksContainer = footer.querySelector("[data-footer-links]");
  if (footerLinksContainer) {
    footerLinksContainer.innerHTML = ""; 
    config.footer.links.forEach((link) => {
      const div = document.createElement("div");
      const h3 = document.createElement("h3");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      h3.appendChild(a);
      div.appendChild(h3);
      footerLinksContainer.appendChild(div);
    });
  }

  footer.querySelector('[data-icon="scroll-top"]').src = config.icons.scrollTop;
}