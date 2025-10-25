// js/customer-home.js

// ★ 変更点: 新しく作ったCustomerProductServiceをインポート
import { CustomerProductService } from '../CustomerProductService.js'
/**
 * CustomerProductServiceを使ってすべての商品データを取得する
 */
async function fetchItems() {
    try {
        // ★ 変更点: 複雑な処理はすべてServiceにお任せ！
        const items = await CustomerProductService.getAllProducts();
        return items;
    } catch (error) {
        // Serviceからエラーが投げられた場合、ここでキャッチする
        console.error("Failed to display items on the page:", error);
        return []; // 画面には何も表示しない
    }
}

/**
 * 取得した商品をHTMLに表示する (この中身は変更ありません)
 */
function displayItems(items) {
    const listContainer = document.getElementById('product-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (items.length === 0) {
        listContainer.innerHTML = '<p>There is no product</p>';
        return;
    }

    items.forEach(item => {
        const cardLink = document.createElement('a');
        cardLink.className = 'card';
        cardLink.href = `./c-home.html?id=${item.id}`;

        const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '../assets/placeholder.jpg';
        const itemName = item.name || 'No Name';
        const itemDesc = item.description || 'No Description';
        const itemPrice = item.price ? `$${item.price}` : 'N/A';

        cardLink.innerHTML = `
      <div class="img">
        <img src="${imageUrl}" alt="${itemName}" />
      </div>
      <p class="name">${itemName}</p>
      <p class="desc">${itemDesc}</p>
      <p class="price">${itemPrice}</p>
    `;
        listContainer.appendChild(cardLink);
    });
}

// ページ読み込み完了時に実行 (変更ありません)
document.addEventListener('DOMContentLoaded', async () => {
    const items = await fetchItems();
    displayItems(items);
});