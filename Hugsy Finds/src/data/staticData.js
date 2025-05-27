// Static product data
export const products = [
  {
    id: 1,
    name: "Vintage Teddy Bear",
    price: 29.99,
    image: "/images/products/teddy1.jpg",
    category: "toys",
    description: "Handcrafted vintage teddy bear made with premium materials.",
    inStock: true,
    isBestSeller: true
  },
  {
    id: 2,
    name: "Handmade Wooden Toy",
    price: 19.99,
    image: "/images/products/toy1.jpg",
    category: "toys",
    description: "Eco-friendly wooden toy, perfect for imaginative play.",
    inStock: true,
    isBestSeller: true
  },
  {
    id: 3,
    name: "Knitted Baby Blanket",
    price: 34.99,
    image: "/images/products/blanket1.jpg",
    category: "home",
    description: "Soft, warm knitted blanket for babies and toddlers.",
    inStock: true,
    isBestSeller: false
  },
  {
    id: 4,
    name: "Decorative Pillow",
    price: 24.99,
    image: "/images/products/pillow1.jpg",
    category: "home",
    description: "Handcrafted decorative pillow with unique patterns.",
    inStock: true,
    isBestSeller: true
  },
  {
    id: 5,
    name: "Ceramic Vase",
    price: 39.99,
    image: "/images/products/vase1.jpg",
    category: "decor",
    description: "Artisan ceramic vase, perfect for fresh or dried flowers.",
    inStock: false,
    isBestSeller: false
  }
];

// Static categories data
export const categories = [
  { id: 1, name: "Toys", slug: "toys", image: "/images/categories/toys.jpg" },
  { id: 2, name: "Home", slug: "home", image: "/images/categories/home.jpg" },
  { id: 3, name: "Decor", slug: "decor", image: "/images/categories/decor.jpg" },
  { id: 4, name: "Gifts", slug: "gifts", image: "/images/categories/gifts.jpg" }
];

// Static customer reviews
export const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "I absolutely love the quality of the handmade items. Will definitely shop here again!",
    date: "2023-05-15"
  },
  {
    id: 2,
    name: "Michael Brown",
    rating: 4,
    comment: "Great products and fast shipping. The wooden toys are amazing.",
    date: "2023-06-02"
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 5,
    comment: "The knitted blanket I purchased is so soft and beautiful. My baby loves it!",
    date: "2023-04-28"
  }
];