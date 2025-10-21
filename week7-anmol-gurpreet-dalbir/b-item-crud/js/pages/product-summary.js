import { ProductService } from "../services/ProductService.js"
import { StorageService } from "../services/StorageService.js"
// @Made By: Gurpreet Singh
document.addEventListener("DOMContentLoaded", () => {
  const dataString = sessionStorage.getItem("currentProductSummary")

  if (!dataString) {
    alert("No product data found. Redirecting to Add Item page.")
    window.location.href = "business-add-item.html"
    return
  }

  const productData = JSON.parse(dataString)
  console.log("[SummaryPage] Loaded data:", productData)

  populateSummaryPage(productData)
  initializeActionButtons(productData)

  setTimeout(() => {
    initializeImageSlider()
    initializeStickyButtonHandler()
  }, 100)
})

function populateSummaryPage(data) {
  setText("dispItemName", data.itemName)
  setText("dispItemPrice", `$${Number.parseFloat(data.price).toFixed(2)}`)
  setText("dispItemDesc", data.description)

  renderImageGallery(data.images)
  renderSizeChart(data.measurementTableUrl)
  renderColorTags(data.colors)
  renderTags("dispSizes", data.sizes)
  renderTags("dispSizeFit", data.sizeFit)
  renderTags("dispMaterial", data.material)
  renderTags("dispTexture", data.texture)
  renderTags("dispStyle", data.style)

  const catGender = [...(data.category || []), data.gender].filter(Boolean)
  renderTags("dispCatGender", catGender)
}

function setText(id, text) {
  const el = document.getElementById(id)
  if (el) el.textContent = text || "N/A"
}

function renderImageGallery(imageUrls) {
  const container = document.getElementById("galleryContainer")
  if (!container) return
  container.innerHTML = ""
  if (!imageUrls || imageUrls.length === 0) {
    container.innerHTML = "<p>No images uploaded.</p>"
    return
  }
  imageUrls.forEach((url) => {
    const img = document.createElement("img")
    img.src = url
    img.alt = "Product Image"
    img.className = "summ-gallery__img"
    container.appendChild(img)
  })
}

function renderSizeChart(url) {
  const container = document.getElementById("sizeChartContainer")
  const img = document.getElementById("dispSizeChart")
  if (!container || !img) return
  if (url) {
    img.src = url
    container.style.display = "block"
  } else {
    container.style.display = "none"
  }
}

function renderTags(containerId, tags) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = ""
  if (!tags || tags.length === 0) {
    container.innerHTML = '<span style="color:#999; font-size:0.9em;">Not specified</span>'
    return
  }
  tags.forEach((tagText) => {
    const span = document.createElement("span")
    span.className = "summ-tag"
    span.textContent = tagText
    container.appendChild(span)
  })
}

function renderColorTags(colors) {
  const container = document.getElementById("dispColors")
  if (!container) return
  container.innerHTML = ""
  if (!colors || colors.length === 0) {
    container.innerHTML = '<span style="color:#999; font-size:0.9em;">Not specified</span>'
    return
  }
  const colorMap = {
    Black: "#000",
    White: "#fff",
    Grey: "#808080",
    "Beige & Cream": "#F5F5DC",
    Brown: "#8B4513",
    Navy: "#000080",
    Red: "#FF0000",
    Pink: "#FFC0CB",
    Orange: "#FFA500",
    Yellow: "#FFFF00",
    Green: "#008000",
    Blue: "#0000FF",
    Purple: "#800080",
  }
  colors.forEach((colorName) => {
    const tag = document.createElement("span")
    tag.className = "summ-tag summ-tag--color"
    const dot = document.createElement("span")
    dot.className = "summ-color-dot"
    dot.style.backgroundColor = colorMap[colorName] || "#ccc"
    if (colorName === "White") dot.style.border = "1px solid #ccc"
    tag.appendChild(dot)
    tag.appendChild(document.createTextNode(colorName))
    container.appendChild(tag)
  })
}

function initializeActionButtons(productData) {
  const editBtn = document.getElementById("editItemBtn")
  const deleteBtn = document.getElementById("deleteItemBtn")

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      sessionStorage.setItem("editProductData", JSON.stringify(productData))
      window.location.href = "business-edit-item.html"
    })
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      showDeleteConfirmModal(async () => {
        console.log(`[SummaryPage] User confirmed deletion for product ID: ${productData.id}`)
        try {
          if (productData.images && productData.images.length > 0) {
            const deleteImagePromises = productData.images.map((url) => StorageService.deleteFileByUrl(url))
            await Promise.all(deleteImagePromises)
          }
          if (productData.measurementTableUrl) {
            await StorageService.deleteFileByUrl(productData.measurementTableUrl)
          }
          await ProductService.deleteProductById(productData.id)
          sessionStorage.removeItem("currentProductSummary")
          window.location.href = "business-add-item.html"
        } catch (error) {
          console.error("[SummaryPage] An error occurred during deletion:", error)
          alert("Failed to delete the item. Please check the console.")
        }
      })
    })
  }
}

function initializeImageSlider() {
  const galleryContainer = document.getElementById("galleryContainer")
  if (!galleryContainer) {
    console.log("[v0] Gallery container not found")
    return
  }

  const images = galleryContainer.querySelectorAll(".summ-gallery__img")
  console.log("[v0] Found", images.length, "images for slider")

  if (images.length <= 1) {
    console.log("[v0] Single or no images, slider not needed")
    return
  }

  const sliderWrapper = document.createElement("div")
  sliderWrapper.className = "summ-gallery__slider-wrapper"

  images.forEach((img) => {
    const slide = document.createElement("div")
    slide.className = "summ-gallery__slide"
    slide.appendChild(img.cloneNode(true))
    sliderWrapper.appendChild(slide)
  })

  galleryContainer.innerHTML = ""
  galleryContainer.appendChild(sliderWrapper)

  const dotsContainer = document.createElement("div")
  dotsContainer.className = "summ-gallery__dots"
  for (let i = 0; i < images.length; i++) {
    const dot = document.createElement("button")
    dot.className = "summ-gallery__dot"
    dot.setAttribute("aria-label", `Go to image ${i + 1}`)
    if (i === 0) dot.classList.add("active")
    dotsContainer.appendChild(dot)
  }
  galleryContainer.appendChild(dotsContainer)

  let currentIndex = 0
  const dots = dotsContainer.querySelectorAll(".summ-gallery__dot")
  let autoSlideInterval = null

  function updateSlider() {
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`
    dots.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex))
    console.log("[v0] Slider updated to index:", currentIndex)
  }

  function startAutoSlide() {
    stopAutoSlide()
    console.log("[v0] Starting auto-slide")
    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length
      console.log("[v0] Auto-advancing to slide:", currentIndex)
      updateSlider()
    }, 3000)
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      console.log("[v0] Stopping auto-slide")
      clearInterval(autoSlideInterval)
      autoSlideInterval = null
    }
  }

  function restartAutoSlide() {
    stopAutoSlide()
    setTimeout(() => {
      console.log("[v0] Restarting auto-slide after delay")
      startAutoSlide()
    }, 3000)
  }

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      console.log("[v0] Dot clicked, going to index:", index)
      currentIndex = index
      updateSlider()
      restartAutoSlide()
    })
  })

  // Touch/drag support
  let startX = 0
  let isDragging = false

  function handleStart(e) {
    isDragging = true
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX
    galleryContainer.classList.add("dragging")
    stopAutoSlide()
  }

  function handleEnd(e) {
    if (!isDragging) return
    isDragging = false
    galleryContainer.classList.remove("dragging")

    const endX = e.type.includes("mouse") ? e.pageX : e.changedTouches[0].clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        currentIndex++
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--
      }
      updateSlider()
    }

    restartAutoSlide()
  }

  galleryContainer.addEventListener("mousedown", handleStart)
  galleryContainer.addEventListener("mouseup", handleEnd)
  galleryContainer.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false
      galleryContainer.classList.remove("dragging")
      restartAutoSlide()
    }
  })

  galleryContainer.addEventListener("touchstart", handleStart, { passive: true })
  galleryContainer.addEventListener("touchend", handleEnd, { passive: true })

  if (window.innerWidth > 768) {
    galleryContainer.addEventListener("mouseenter", stopAutoSlide)
    galleryContainer.addEventListener("mouseleave", startAutoSlide)
  }

  startAutoSlide()

  console.log("[v0] Image slider initialized successfully with auto-slide")
}

function initializeStickyButtonHandler() {
  if (window.innerWidth > 768) return

  const actionButtons = document.querySelector(".summ-action-buttons")
  const sizeChartContainer = document.getElementById("sizeChartContainer")
  const detailsSection = document.querySelector(".summ-details")

  if (!actionButtons || !sizeChartContainer || !detailsSection) {
    console.log("[v0] Required elements not found for sticky handler")
    return
  }

  function handleScroll() {
    const sizeChartRect = sizeChartContainer.getBoundingClientRect()
    const scrolledPastChart = sizeChartRect.bottom < window.innerHeight - 100

    actionButtons.classList.toggle("static", scrolledPastChart)
    detailsSection.classList.toggle("buttons-static", scrolledPastChart)
  }

  let scrollTimeout
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(handleScroll, 50)
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      actionButtons.classList.remove("static")
      detailsSection.classList.remove("buttons-static")
    } else {
      handleScroll()
    }
  })

  handleScroll()
  console.log("[v0] Sticky button handler initialized")
}

function showDeleteConfirmModal(onConfirm) {
  const overlay = document.createElement("div")
  overlay.className = "modal-overlay"

  const container = document.createElement("div")
  container.className = "modal-container"

  container.innerHTML = `
    <div class="modal-icon">
      <svg width="62" height="66" viewBox="0 0 62 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1278_18927)">
          <path d="M11.3952 65.251C9.23203 65.251 7.47073 63.4897 7.47073 61.3265V23.0981C7.47073 22.9681 7.36435 22.8617 7.23432 22.8617H3.9245C1.7613 22.8617 0 21.1004 0 18.9372C0 16.774 1.7613 15.0127 3.9245 15.0127H58.0637C60.2269 15.0127 61.9882 16.774 61.9882 18.9372C61.9882 21.1004 60.2269 22.8617 58.0637 22.8617H54.7539C54.6238 22.8617 54.5174 22.9681 54.5174 23.0981V61.3265C54.5174 63.4897 52.7561 65.251 50.5929 65.251H11.3952ZM15.568 22.8617C15.4379 22.8617 15.3316 22.9681 15.3316 23.0981V57.1538C15.3316 57.2838 15.4379 57.3902 15.568 57.3902H46.432C46.5621 57.3902 46.6684 57.2838 46.6684 57.1538V23.0981C46.6684 22.9681 46.5621 22.8617 46.432 22.8617H15.568Z" fill="#06324f"/>
          <path d="M38.7958 10.0949C38.0983 10.0949 37.4009 9.90582 36.7981 9.53937C34.9422 8.44004 32.9918 7.87264 30.9822 7.87264C27.8379 7.87264 25.6274 9.25567 25.391 9.40934C24.7409 9.83489 23.9843 10.0595 23.2042 10.0595C21.892 10.0595 20.6745 9.42116 19.9534 8.34547C18.7477 6.57235 19.1969 4.14909 20.9464 2.93155C21.1237 2.81335 25.2255 0 31.0532 0C34.4221 0 37.7083 0.933842 40.8171 2.7897C41.7155 3.32164 42.3538 4.18456 42.6139 5.20114C42.8739 6.21773 42.7203 7.26978 42.1765 8.17998C41.4673 9.36206 40.1788 10.0949 38.7958 10.0949Z" fill="#06324f"/>
          <path d="M24.587 48.7489C22.9558 48.7489 21.6318 46.9876 21.6318 44.8244V34.8122C21.6318 32.649 22.9558 30.8877 24.587 30.8877C26.2183 30.8877 27.5422 32.649 27.5422 34.8122V44.8244C27.5422 46.9876 26.2183 48.7489 24.587 48.7489Z" fill="#06324f"/>
          <path d="M37.2355 48.7489C35.6042 48.7489 34.2803 46.9876 34.2803 44.8244V34.8122C34.2803 32.649 35.6042 30.8877 37.2355 30.8877C38.8667 30.8877 40.1907 32.649 40.1907 34.8122V44.8244C40.1907 46.9876 38.8667 48.7489 37.2355 48.7489Z" fill="#06324f"/>
        </g>
        <defs>
          <clipPath id="clip0_1278_18927">
            <rect width="62" height="65.2507" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
    <h2 class="modal-title">Are you sure you want to delete this registered item?</h2>
    <div class="modal-buttons">
        <button class="modal-btn modal-btn--confirm">DELETE</button>
        <button class="modal-btn modal-btn--cancel">CANCEL</button>
    </div>
  `

  overlay.appendChild(container)
  document.body.appendChild(overlay)

  setTimeout(() => overlay.classList.add("active"), 10)

  const closeModal = () => {
    overlay.classList.remove("active")
    setTimeout(() => overlay.remove(), 300)
  }

  container.querySelector(".modal-btn--cancel").addEventListener("click", closeModal)
  container.querySelector(".modal-btn--confirm").addEventListener("click", () => {
    closeModal()
    if (onConfirm) onConfirm()
  })
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal()
  })

  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeModal()
      document.removeEventListener("keydown", escHandler)
    }
  })
}
