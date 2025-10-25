const swipeItems = document.querySelector(".swipe-items");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

let currentScroll = 0;

// Dynamically calculate item width and gap
function getMoveDistance() {
  const item = swipeItems.querySelector("img");
  const itemStyle = window.getComputedStyle(item);
  const itemWidth = item.offsetWidth;
  const gap = parseInt(itemStyle.marginRight) || 16; // fallback if gap not set
  return itemWidth + gap;
}

function getMaxScroll() {
  return swipeItems.scrollWidth - swipeItems.clientWidth;
}

// Scroll right
rightBtn.addEventListener("click", () => {
  const moveDistance = getMoveDistance();
  const maxScroll = getMaxScroll();
  currentScroll = Math.min(currentScroll + moveDistance, maxScroll);
  swipeItems.scrollTo({ left: currentScroll, behavior: "smooth" });
});

// Scroll left
leftBtn.addEventListener("click", () => {
  const moveDistance = getMoveDistance();
  currentScroll = Math.max(currentScroll - moveDistance, 0);
  swipeItems.scrollTo({ left: currentScroll, behavior: "smooth" });
});

//Scroll top
const scrollTopBtn = document.querySelector(".scroll-top");

// for tablet
if (scrollTopBtn && window.innerWidth <= 1024) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

