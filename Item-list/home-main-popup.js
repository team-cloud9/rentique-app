// ===== Recommend Popup =====
const swipeImages = document.querySelectorAll(".swipe-items .item");
const swipePopup = document.getElementById("swipePopup");
const closeSwipePopup = document.getElementById("closePopup");

swipeImages.forEach((img) => {
    img.addEventListener("click", () => {
        // showimage
        const popupImage = document.getElementById("popupImage");
        popupImage.src = img.src;
        swipePopup.style.display = "block";
    });
});

// close
if (closeSwipePopup && swipePopup) {
    closeSwipePopup.addEventListener("click", () => {
        swipePopup.style.display = "none";
    });
}

// click outside and close
window.addEventListener("click", (event) => {
    if (event.target === swipePopup) {
        swipePopup.style.display = "none";
    }
});