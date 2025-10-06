// Filter button toggle
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');
    });
});

// Apply button
document.querySelector('.apply-btn').addEventListener('click', function () {
    const activeFilters = document.querySelectorAll('.filter-btn.active');
    alert('Applied ' + activeFilters.length + ' filters!');
});


// // Filter button toggle
// document.querySelectorAll('.filter-btn').forEach(btn => {
//     btn.addEventListener('click', function () {
//         this.classList.toggle('active');
//     });
// });

// // Range slider display
// const priceRange = document.getElementById('priceRange');
// const distanceRange = document.getElementById('distanceRange');

// priceRange.addEventListener('input', function () {
//     console.log('Price: $' + this.value);
// });

// distanceRange.addEventListener('input', function () {
//     console.log('Distance: ' + this.value + 'km');
// });

// // Apply button
// document.querySelector('.apply-btn').addEventListener('click', function () {
//     const activeFilters = document.querySelectorAll('.filter-btn.active');
//     alert('Applied ' + activeFilters.length + ' filters!');
// });