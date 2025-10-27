// ProductData.js - All product data
const itemProducts = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1667586680656-6b8e381cddb5?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [
            { name: "Gray", code: "gray" },
        ],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop",
        title: "Summer Dress",
        brand: "Beach Vibes",
        description: "Light semi-casual dress for summer.",
        price: 35,
        colors: [
            { name: "red", code: "red" },
        ],
        size: ["Small", "Medium"],
        season: ["Summer"],
        texture: ["Plain"],
        material: ["Cotton", "Linen"],
        style: ["Casual", "Beach"]
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=700&fit=crop",
        title: "Casual T-Shirts",
        brand: "Urban Style",
        description: "Classic simple cotton t-shirts.",
        price: 20,
        colors: [
            { name: "Black", code: "black" },
            { name: "Gray", code: "gray" }
        ],
        size: ["Large"],
        season: ["Summer"],
        texture: ["Solid"],
        material: ["Cotton", "Polyester"],
        style: ["Casual", "Street"]
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1598032895455-526c9e347a87?w=500&h=700&fit=crop",
        title: "Business/Office light shirts",
        brand: "Office Collection",
        description: "Professional tailored suit for office wear.",
        price: 50,
        colors: [
            { name: "Blue", code: "blue" },
            { name: "Green", code: "#90EE90" }
        ],
        size: ["Small", "Medium"],
        season: ["Summer"],
        texture: ["Plain"],
        material: ["Cotton", "Silk"],
        style: ["Formal", "Business"]
    },
    {
        id: 5,
        image: "https://plus.unsplash.com/premium_photo-1673757121126-cbf64f316bab?w=500&h=700&fit=crop",
        title: "Urban Sweater",
        brand: "Street Kings",
        description: "Modern sweater with cute patterns.",
        price: 25,
        colors: [
            { name: "White", code: "white" },
            { name: "Beige", code: "beige" }
        ],
        size: ["Medium", "Large"],
        season: ["Automn"],
        texture: ["Knitted"],
        material: ["Cotton", "Polyester"],
        style: ["Casual", "Urban"]
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=700&fit=crop",
        title: "Camel Long Jacket",
        brand: "Executive Line",
        description: "Camel long outer in any scene.",
        price: 60,
        colors: [
            { name: "Camel", code: "#9a742eff" },
            { name: "Brown", code: "brown" }
        ],
        size: ["Medium", "Large"],
        season: ["All Season"],
        texture: ["Plain"],
        material: ["Wool", "Cotton"],
        style: ["Formal", "Casual"]
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?w=500&h=700&fit=crop",
        title: "Blue Jeans",
        brand: "Active Jeans",
        description: "Classic blue jeans.",
        price: 30,
        colors: [
            { name: "Blue", code: "blue" },
        ],
        size: ["Small", "Medium", "Large"],
        season: ["Summer"],
        texture: ["Plain"],
        material: ["Polyester", "Spandex"],
        style: ["Athletic", "Casual"]
    },
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=700&fit=crop",
        title: "Bohemian maxi dress",
        brand: "Free Spirit",
        description: "Flowing maxi dress with ethnic patterns.",
        price: 110,
        colors: [
            { name: "White", code: "white" },
            { name: "Orange", code: "#FFA500" }
        ],
        size: ["Small", "Medium"],
        season: ["Spring", "Summer"],
        texture: ["Patterned"],
        material: ["Rayon", "Cotton"],
        style: ["Bohemian", "Casual"]
    },
    {
        id: 9,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=700&fit=crop",
        title: "Classic Leather Jacket",
        brand: "Vintage Threads",
        description: "Timeless leather jacket with distressed finish.",
        price: 50,
        colors: [
            { name: "Black", code: "black" },
            { name: "Dark Gray", code: "#25252bff" }
        ],
        size: ["Small", "Medium", "Large"],
        season: ["Spring", "Autumn"],
        texture: ["Denim"],
        material: ["Cotton", "Denim"],
        style: ["Casual", "Vintage"]
    },
    {
        id: 10,
        image: "https://images.unsplash.com/photo-1542406775-ade58c52d2e4?w=500&h=700&fit=crop",
        title: "Hoodie",
        brand: "Urban Fit",
        description: "Simple black hoodie with graphics.",
        price: 30,
        colors: [
            { name: "Black", code: "black" },
        ],
        size: ["Small", "Medium"],
        season: ["Automn"],
        texture: ["Sequined"],
        material: ["Silk", "Polyester"],
        style: ["Casual", "Street"]
    }
];

// ============================
// SWIPE PRODUCTS
// ============================
const swipeProducts = [
    {
        id: 20,
        image: "https://plus.unsplash.com/premium_photo-1698952163284-8ab2e22a5dd4?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 21,
        image: "https://images.unsplash.com/photo-1582274528667-1e8a10ded835?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 22,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 23,
        image: "https://images.unsplash.com/photo-1729808783993-fda4a4f407ce?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 24,
        image: "https://images.unsplash.com/photo-1632262049811-86d23941618b?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 25,
        image: "https://images.unsplash.com/photo-1554925051-f668ed70d520?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 26,
        image: "https://images.unsplash.com/photo-1582164256364-b0eccb922bff?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 27,
        image: "https://images.unsplash.com/photo-1613432539593-bb769c287e08?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 28,
        image: "https://images.unsplash.com/photo-1634748210255-af588c16652a?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 29,
        image: "https://plus.unsplash.com/premium_photo-1664297992890-07809e72c79e?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 30,
        image: "https://plus.unsplash.com/premium_photo-1675253119026-b1c8b2802ce1?w=500&h=700&fit=crop",
        title: "Cozy Sweater",
        brand: "Alissa Clothing",
        description: "A cozy sweater keeps you warm.",
        price: 20,
        colors: [{ name: "Gray", code: "gray" }],
        size: ["Medium"],
        season: ["Winter"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },

];