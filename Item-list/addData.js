import { firestore } from './firebase-config.js';
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// storage data
// const clothesData = [
//   {
//     itemName: "Classic White Shirt",
//     category: "Tops",
//     color: "White",
//     size: ["S", "M", "L"],
//     material: "Cotton",
//     season: "Spring",
//     style: ["Casual", "Formal"]
//   },
//   {
//     itemName: "Vintage Denim Jacket",
//     category: "Jackets",
//     color: "Blue",
//     size: ["M", "L"],
//     material: "Denim",
//     season: "Autumn",
//     style: ["Street", "Casual"]
//   },
//   {
//     itemName: "Black Suit Set",
//     category: "Suits",
//     color: "Black",
//     size: ["M", "L"],
//     material: "Wool",
//     season: "Winter",
//     style: ["Formal", "Business"]
//   },
// ];

async function addAllClothes() {
  try {
    for (const item of clothesData) {
      await addDoc(collection(firestore, "products"), {
        ...item,
        createdAt: serverTimestamp()
      });
      console.log(`${item.itemName} added successfully!`);
    }
    alert("All 10 items added to Firestore!");
  } catch (error) {
    console.error("Error adding items: ", error);
  }
}

addAllClothes();