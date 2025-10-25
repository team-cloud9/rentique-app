//made by Anmol
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


async function fetchItems() {
  try {
    const productsCol = collection(firestore, 'Products');
    const productSnapshot = await getDocs(productsCol);
    console.log("Fetched items:", productSnapshot.docs.length); // 取得できた件数をログに出力
    return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching items from Firestore:", error);
    return [];
  }
}
//

// init firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * @param {Array} items - array of product data
 */
function displayItems(items) {
  const listContainer = document.getElementById('product-list-container');
  if (!listContainer) return; // if there is no container, not fill

  listContainer.innerHTML = ''; // empty containers

  if (items.length === 0) {
    listContainer.innerHTML = '<p>there is no products</p>';
    return;
  }

  items.forEach(item => {
    // create new <a>, class "card"
    const cardLink = document.createElement('a');
    cardLink.className = 'card';
    cardLink.href = `./c-itemdetail.html?id=${item.id}`;

    console.log("Displaying item:", item);

    /* 
      create in the HTML
      class: "img", "name", "desc", "price" 
    */
    cardLink.innerHTML = `
      <div class="img">
        <img src="${item.images && item.images.length > 0 ? item.images[0] : 'path/to/placeholder.jpg'}" alt="${item.name}" />
      </div>
      <p class="name">${item.name}</p>
      <p class="desc">${item.description}</p>
      <p class="price">$${item.price}</p>
    `;

    // add in the container
    listContainer.appendChild(cardLink);
  });
}

// run when complete loading
document.addEventListener('DOMContentLoaded', async () => {
  const items = await fetchItems();
  displayItems(items);
});
