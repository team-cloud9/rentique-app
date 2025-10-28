// @Made By Gurpreet Singh
import { getProductsByBusiness } from "../../services/business-side/HomePageService.js"
import { getChatsForBusiness } from "../../services/business-side/HomeChatService.js"

// Get references to the DOM elements
const itemsGridEl = document.getElementById("itemsGrid")
const chatListEl = document.getElementById("chatList")
const prevBtn = document.querySelector(".carousel-btn.prev-btn")
const nextBtn = document.querySelector(".carousel-btn.next-btn")
const fab = document.getElementById("addBtn")
const footer = document.getElementById("footer-placeholder")

// --- Hardcoded values for development ---
const DEV_BUSINESS_ID = "7aSYsKpsiw3UNKDS3SDz"
const DEV_PROFILE_ID = "pChoL7F6VAWS3vgexBELLxOzUxH3"

// const DEV_BUSINESS_ID = "5QpQ6xRG9kH5NHKxpPPG"
// const DEV_PROFILE_ID = "TTiTIKGJwXWxBljdlaxw9A5ckyd2"

// const DEV_BUSINESS_ID = "alsfQA0SlronK23HyvF1"
// const DEV_PROFILE_ID = "8bB6HsfJGOfRyot9SFuXdEvOrh23"



function renderProducts(products) {
  if (!products || products.length === 0) {
    itemsGridEl.innerHTML = '<p>You have not added any items yet. Click the "+" button to get started!</p>'
    return
  }
  itemsGridEl.innerHTML = ""
  products.forEach((product) => {
    const card = document.createElement("div")
    card.className = "item-card"
    card.dataset.productId = product.id
    const imageUrl =
      product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/300x400"
    const price = product.price ? `$${product.price}` : "Price not set"
    card.innerHTML = `
      <img src="${imageUrl}" alt="${product.itemName}" class="item-image">
      <div class="item-details">
        <div class="item-header">
          <h3 class="item-name">${product.itemName}</h3>
          <p class="item-price">${price}</p>
        </div>
        <p class="item-description">${product.description.substring(0, 50)}...</p>
        <div class="item-footer">
          <span class="item-brand">${product.businessName}</span>
          <button class="edit-btn" aria-label="Edit item">
            <img src="/assets/icons/Icon_pencil.svg" alt="Edit">
          </button>
        </div>
      </div>
    `
    itemsGridEl.appendChild(card)
  })
}


function renderChats(chats) {
  if (!chats || chats.length === 0) {
    chatListEl.innerHTML = "<p>No active chats.</p>"
    if (prevBtn) prevBtn.style.display = "none"
    if (nextBtn) nextBtn.style.display = "none"
    return
  }
  chatListEl.innerHTML = ""

  chats.forEach((chat) => {
    const customer = chat.customerProfile
    const avatarUrl = customer.profileImageUrl || "https://via.placeholder.com/100"

    const chatItem = document.createElement("div")
    chatItem.className = "chat-item"
    chatItem.dataset.chatId = chat.chatId
    chatItem.innerHTML = `
      <img src="${avatarUrl}" alt="${customer.displayName}" class="chat-avatar" title="${customer.displayName}">
    `
    chatListEl.appendChild(chatItem)
  })
}


function updateCarouselButtons() {
  if (!chatListEl || !prevBtn || !nextBtn) return
  const scrollBuffer = 5
  const isAtStart = chatListEl.scrollLeft <= 0
  const isAtEnd = chatListEl.scrollLeft >= chatListEl.scrollWidth - chatListEl.clientWidth - scrollBuffer
  prevBtn.style.display = isAtStart ? "none" : "flex"
  nextBtn.style.display = isAtEnd ? "none" : "flex"
}

function adjustFabPosition() {
  if (!fab || !footer) return

  const footerRect = footer.getBoundingClientRect()
  const fabHeight = fab.offsetHeight
  const fabBottomMargin = 96 // 2rem = 32px
  const windowHeight = window.innerHeight
  const footerTop = footerRect.top
  const fabBottom = windowHeight - fabBottomMargin
  if (footerTop < fabBottom + fabHeight) {
    fab.style.position = "absolute"
    fab.style.bottom = "auto"

    const scrollY = window.scrollY || window.pageYOffset
    const footerTopFromDocument = scrollY + footerTop
    const fabTopPosition = footerTopFromDocument - fabHeight - fabBottomMargin + 63;

    fab.style.top = fabTopPosition + "px"
  } else {
    fab.style.position = "fixed"
    fab.style.top = "auto"
    if(window.innerWidth > 1024){
    fab.style.bottom = "1rem"
    }else if(window.innerWidth < 1024){
    fab.style.bottom = "6rem"
    }
  }
}

async function initializePage() {
  itemsGridEl.innerHTML = "<p>Loading your items...</p>"
  chatListEl.innerHTML = "<p>Loading chats...</p>"

  const [products, chats] = await Promise.all([
    getProductsByBusiness(DEV_BUSINESS_ID),
    getChatsForBusiness(DEV_PROFILE_ID),
  ])

  renderProducts(products)
  renderChats(chats)

  updateCarouselButtons()

  adjustFabPosition()
}
document.addEventListener("DOMContentLoaded", () => {
  initializePage()

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      chatListEl.scrollBy({ left: -300, behavior: "smooth" })
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      chatListEl.scrollBy({ left: 300, behavior: "smooth" })
    })
  }

  if (chatListEl) {
    chatListEl.addEventListener("scroll", updateCarouselButtons)
  }

  window.addEventListener("scroll", adjustFabPosition)

  window.addEventListener("resize", adjustFabPosition)

  if (fab) {
    fab.addEventListener("click", () => {
      window.location.href = "/view/business-side/pages/b-add-item.html"
    })
  }
  window.addEventListener("resize", updateCarouselButtons)
})
