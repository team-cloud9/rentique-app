// ProductData.js - All product data
const swipeProducts = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=700&fit=crop",
        title: "Autumn cozy outfit",
        brand: "Alissa Clothing",
        description: "A cozy camel sweater paired with beige khaki pants.",
        price: 120,
        colors: [
            { name: "Brown", code: "brown" },
            { name: "Beige", code: "beige" }
        ],
        size: ["Medium"],
        season: ["Autumn"],
        texture: ["Plain"],
        material: ["Knitted fabric", "Khaki"],
        style: ["Casual"]
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&h=700&fit=crop",
        title: "Summer casual set",
        brand: "Beach Vibes",
        description: "Light cotton shirt with comfortable shorts.",
        price: 85,
        colors: [
            { name: "White", code: "white" },
            { name: "Blue", code: "#4A90E2" }
        ],
        size: ["Small", "Medium"],
        season: ["Summer"],
        texture: ["Plain"],
        material: ["Cotton", "Linen"],
        style: ["Casual", "Beach"]
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=700&fit=crop",
        title: "Winter elegant coat",
        brand: "Urban Style",
        description: "Classic wool coat perfect for cold weather.",
        price: 250,
        colors: [
            { name: "Black", code: "black" },
            { name: "Gray", code: "gray" }
        ],
        size: ["Large"],
        season: ["Winter"],
        texture: ["Solid"],
        material: ["Wool", "Polyester"],
        style: ["Elegant", "Formal"]
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=700&fit=crop",
        title: "Spring floral dress",
        brand: "Garden Collection",
        description: "Light and breezy floral pattern dress.",
        price: 95,
        colors: [
            { name: "Pink", code: "#FFC0CB" },
            { name: "Green", code: "#90EE90" }
        ],
        size: ["Small", "Medium"],
        season: ["Spring"],
        texture: ["Floral"],
        material: ["Cotton", "Silk"],
        style: ["Romantic", "Casual"]
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=700&fit=crop",
        title: "Urban streetwear",
        brand: "Street Kings",
        description: "Modern streetwear with bold graphics.",
        price: 75,
        colors: [
            { name: "Black", code: "black" },
            { name: "Red", code: "red" }
        ],
        size: ["Medium", "Large"],
        season: ["All Season"],
        texture: ["Graphic"],
        material: ["Cotton", "Polyester"],
        style: ["Street", "Urban"]
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=700&fit=crop",
        title: "Business formal suit",
        brand: "Executive Line",
        description: "Professional tailored suit for office wear.",
        price: 320,
        colors: [
            { name: "Navy", code: "#000080" },
            { name: "Charcoal", code: "#36454F" }
        ],
        size: ["Medium", "Large"],
        season: ["All Season"],
        texture: ["Plain"],
        material: ["Wool", "Cotton"],
        style: ["Formal", "Business"]
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=700&fit=crop",
        title: "Athletic sportswear",
        brand: "Active Motion",
        description: "Breathable sports outfit for workout sessions.",
        price: 65,
        colors: [
            { name: "Neon Green", code: "#39FF14" },
            { name: "Black", code: "black" }
        ],
        size: ["Small", "Medium", "Large"],
        season: ["All Season"],
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
            { name: "Turquoise", code: "#40E0D0" },
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
        title: "Classic denim jacket",
        brand: "Vintage Threads",
        description: "Timeless denim jacket with distressed finish.",
        price: 89,
        colors: [
            { name: "Light Blue", code: "#ADD8E6" },
            { name: "Dark Blue", code: "#00008B" }
        ],
        size: ["Small", "Medium", "Large"],
        season: ["Spring", "Autumn"],
        texture: ["Denim"],
        material: ["Cotton", "Denim"],
        style: ["Casual", "Vintage"]
    },
    {
        id: 10,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=700&fit=crop",
        title: "Evening cocktail dress",
        brand: "Glamour Night",
        description: "Elegant sequined dress for special occasions.",
        price: 180,
        colors: [
            { name: "Gold", code: "#FFD700" },
            { name: "Silver", code: "#C0C0C0" }
        ],
        size: ["Small", "Medium"],
        season: ["All Season"],
        texture: ["Sequined"],
        material: ["Silk", "Polyester"],
        style: ["Elegant", "Party"]
    }
];