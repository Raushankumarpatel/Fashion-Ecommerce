const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Raushan:e8voper3Ogphuq4d@cluster0.pung0de.mongodb.net/fashion_ecommerce";
const mockProducts = [
  {
    name: "Classic Slim Fit Denim Shirt",
    price: 1499,
    category: "Men",
    stock: 25,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
    description: "Premium pure cotton slim-fit denim shirt, breathable and stylish.",
    size: ["S", "M", "L", "XL"],
    color: ["Blue", "Light Blue"]
  },
  {
    name: "Urban Linen Casual Trousers",
    price: 1899,
    category: "Men",
    stock: 30,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
    description: "Comfortable breathable linen trousers for a relaxed summer fit.",
    size: ["M", "L", "XL"],
    color: ["Beige", "White", "Navy"]
  },
  {
    name: "Floral Summer Wrap Dress",
    price: 2499,
    category: "Women",
    stock: 18,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    description: "Elegant floral print wrap dress with short sleeves and dynamic detailing.",
    size: ["S", "M", "L"],
    color: ["Red", "Yellow", "Blue"]
  },
  {
    name: "Premium Silk Party Gown",
    price: 4999,
    category: "Women",
    stock: 8,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
    description: "Stunning pure silk evening gown with side slit, custom tailored.",
    size: ["S", "M", "L"],
    color: ["Emerald Green", "Midnight Black", "Ruby Red"]
  },
  {
    name: "Cotton Dino Print T-shirt Set",
    price: 899,
    category: "Kids",
    stock: 40,
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500",
    description: "Pack of 2 comfortable organic cotton dinosaur print t-shirts for toddlers.",
    size: ["2-3 Y", "4-5 Y", "6-7 Y"],
    color: ["Green", "Grey"]
  },
  {
    name: "Classic Leather Chelsea Boots",
    price: 3499,
    category: "Footwear",
    stock: 12,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500",
    description: "Genuine leather Chelsea boots with elastic side panels and pull tabs.",
    size: ["UK 7", "UK 8", "UK 9", "UK 10"],
    color: ["Brown", "Tan Black"]
  },
  {
    name: "Ultra-Lightweight Knit Sneakers",
    price: 2199,
    category: "Footwear",
    stock: 3,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    description: "High-performance running sneakers made from recycled polyester fibers.",
    size: ["UK 8", "UK 9", "UK 10"],
    color: ["Red-White", "Black"]
  },
  {
    name: "Minimalist Rose Gold Watch",
    price: 4299,
    category: "Accessories",
    stock: 15,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
    description: "Sleek stainless steel watch featuring a minimalist dial and mesh strap.",
    size: ["Standard"],
    color: ["Rose Gold", "Silver"]
  },
  {
    name: "Vintage Leather Messenger Bag",
    price: 2999,
    category: "Accessories",
    stock: 6,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    description: "Handcrafted top-grain leather messenger bag with dedicated laptop sleeve.",
    size: ["Standard"],
    color: ["Dark Brown", "Tan"]
  },
  {
    name: "High-Waist Seamless Gym Leggings",
    price: 1599,
    category: "Activewear",
    stock: 22,
    image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500",
    description: "Moisture-wicking squat-proof compression leggings for intensive workouts.",
    size: ["S", "M", "L"],
    color: ["Slate Grey", "Black", "Plum"]
  },
  {
    name: "Oversized Woolen Sherpa Jacket",
    price: 3899,
    category: "Winterwear",
    stock: 5,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500",
    description: "Plush Sherpa fleece lining with a premium insulated woolen shell.",
    size: ["M", "L", "XL"],
    color: ["Cream", "Olive Green"]
  },
  {
    name: "Traditional Silk Banarasi Saree",
    price: 3499,
    category: "Women",
    stock: 15,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
    description: "Exquisite handwoven Banarasi silk saree with gold zari border, perfect for weddings and festivals.",
    size: ["Free Size"],
    color: ["Royal Red", "Golden-Orange", "Pink"]
  },
  {
    name: "Men's Classic Leather Derby Shoes",
    price: 2799,
    category: "Footwear",
    stock: 20,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500",
    description: "Polished full-grain leather dress shoes for formal and business wear.",
    size: ["UK 7", "UK 8", "UK 9", "UK 10"],
    color: ["Tan Brown", "Classic Black"]
  },
  {
    name: "Women's Lightweight Running Shoes",
    price: 2499,
    category: "Footwear",
    stock: 18,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
    description: "Comfortable cushioned sole activewear shoes designed for daily exercise and running.",
    size: ["UK 4", "UK 5", "UK 6", "UK 7"],
    color: ["Neon Pink", "Grey-White", "Midnight Black"]
  },
  {
    name: "Designer Embroidered Cotton Kurti",
    price: 1299,
    category: "Women",
    stock: 25,
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500",
    description: "Beautiful ethnic cotton kurti with elegant thread embroidery on the neck.",
    size: ["S", "M", "L", "XL"],
    color: ["Mustard Yellow", "Peach Pink"]
  },
  {
    name: "Premium Oxford Cotton Casual Shirt",
    price: 1599,
    category: "Men",
    stock: 30,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
    description: "Classic button-down Oxford cotton shirt, structured fit for a smart casual look.",
    size: ["S", "M", "L", "XL"],
    color: ["White", "Light Blue", "Pink"]
  },
  {
    name: "Unisex Crewneck Cotton T-Shirt",
    price: 699,
    category: "Men",
    stock: 50,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
    description: "Super soft 100% organic cotton everyday essential t-shirt.",
    size: ["S", "M", "L", "XL"],
    color: ["Black", "Heather Grey", "Olive Green"]
  },
  {
    name: "Men's Slim Fit Chino Pants",
    price: 1799,
    category: "Men",
    stock: 22,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
    description: "Stylish and stretchable cotton chinos, ideal for office and weekend wear.",
    size: ["30", "32", "34", "36"],
    color: ["Beige Chino", "Navy Blue", "Olive"]
  },
  {
    name: "Women's High-Rise Denim Jeans",
    price: 1999,
    category: "Women",
    stock: 24,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    description: "Stretchable high-waist denim jeans with classic 5-pocket styling.",
    size: ["28", "30", "32", "34"],
    color: ["Dark Wash Blue", "Light Indigo", "Solid Black"]
  },
  {
    name: "Women's Elegant Block Heel Sandals",
    price: 1699,
    category: "Footwear",
    stock: 14,
    image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=500",
    description: "Comfortable block heel sandals with adjustable strap, suitable for parties.",
    size: ["UK 4", "UK 5", "UK 6", "UK 7"],
    color: ["Nude Gold", "Glossy Black"]
  }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // 1. Create or Find default seller
    const email = "retailer@fashion.com";
    let seller = await User.findOne({ email });

    if (!seller) {
      console.log("Creating default seller: retailer@fashion.com");
      const hashedPassword = await bcrypt.hash("password123", 10);
      seller = await User.create({
        name: "Fashion Retailer Ltd",
        email,
        password: hashedPassword,
        role: "seller",
      });
      console.log("Seller created.");
    } else {
      console.log("Default seller already exists.");
    }

    // 2. Clear old products (Commented out to prevent deleting user's products)
    // console.log("Cleaning products collection...");
    // await Product.deleteMany({});

    // 3. Add products linked to this seller (avoid duplicate additions if already seeded)
    console.log("Checking and inserting products...");
    let insertedCount = 0;
    for (const productData of mockProducts) {
      const exists = await Product.findOne({ name: productData.name });
      if (!exists) {
        await Product.create({
          ...productData,
          seller: seller._id,
        });
        insertedCount++;
      } else {
        await Product.updateOne(
          { _id: exists._id },
          { $set: { image: productData.image } }
        );
      }
    }

    console.log(`Successfully seeded ${insertedCount} new products (skipped existing ones)!`);

    mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDatabase();
