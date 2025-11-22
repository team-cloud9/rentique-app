// @Made By: Anmol Singh
const chatData = [
  {
    id: 1,
    name: "Customer 1",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Customer 2",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Customer 3",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Customer 4",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Customer 5",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    name: "Customer 6",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
  },
]

const itemsData = [
  {
    id: 1,
    name: "Casual Denim Shorts",
    description: "Comfy style for daily wear",
    brand: "Brand Name",
    price: 90.0,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop",
  },
  {
    id: 2,
    name: "Elegant Dress",
    description: "Flow and Chic",
    brand: "Brand Name",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
  },
  {
    id: 3,
    name: "Winter Coat",
    description: "Children Coat",
    brand: "Brand Name",
    price: 100.0,
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=800&fit=crop",
  },
  {
    id: 4,
    name: "Professional Outfit",
    description: "Business casual style",
    brand: "Brand Name",
    price: 150.0,
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop",
  },
  {
    id: 5,
    name: "Summer Dress",
    description: "Light and breezy",
    brand: "Brand Name",
    price: 85.0,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
  },
  {
    id: 6,
    name: "Casual Jacket",
    description: "Everyday comfort",
    brand: "Brand Name",
    price: 110.0,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
  },
  {
    id: 7,
    name: "Evening Gown",
    description: "Elegant and sophisticated",
    brand: "Brand Name",
    price: 200.0,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
  },
  {
    id: 8,
    name: "Sporty Outfit",
    description: "Active lifestyle",
    brand: "Brand Name",
    price: 75.0,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
  },
]

document.addEventListener("DOMContentLoaded", () => {
  renderChatList()
  renderItemsGrid()
  initializeCarousel()
  initializeTabs()
  initializeFAB()
})

function renderChatList() {
  const chatList = document.getElementById("chatList")
  chatList.innerHTML = chatData
    .map(
      (chat) => `
        <div class="chat-item" data-id="${chat.id}">
            <img src="${chat.avatar}" alt="${chat.name}" class="chat-avatar">
        </div>
    `,
    )
    .join("")
  document.querySelectorAll(".chat-item").forEach((item) => {
    item.addEventListener("click", () => {
      const chatId = item.dataset.id
      console.log("[v0] Chat clicked:", chatId)
    })
  })
}

function renderItemsGrid() {
  const itemsGrid = document.getElementById("itemsGrid")
  itemsGrid.innerHTML = itemsData
    .map(
      (item) => `
        <div class="item-card" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-header">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="item-brand">${item.brand}</span>
                    <button class="edit-btn" data-id="${item.id}" aria-label="Edit item">
                        <img src="./assets/icons/edit.svg" alt="Edit">
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      const itemId = btn.dataset.id
      console.log("[v0] Edit item:", itemId)
      window.location.href = `edit-item.html?id=${itemId}`
    })
  })

  document.querySelectorAll(".item-card").forEach((card) => {
    card.addEventListener("click", () => {
      const itemId = card.dataset.id
      console.log("[v0] Item clicked:", itemId)
    })
  })
}

function initializeCarousel() {
  const chatList = document.getElementById("chatList")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      chatList.scrollBy({
        left: -300,
        behavior: "smooth",
      })
    })

    nextBtn.addEventListener("click", () => {
      chatList.scrollBy({
        left: 300,
        behavior: "smooth",
      })
    })
  }
}

function initializeTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const tabType = btn.dataset.tab
      console.log("[v0] Tab switched to:", tabType)
    })
  })
}

function initializeFAB() {
  const fab = document.getElementById("addBtn")

  fab.addEventListener("click", () => {
    console.log("[v0] Add button clicked")
    window.location.href = "../../b-item-crud/pages/business-add-item.html"
  })
}

