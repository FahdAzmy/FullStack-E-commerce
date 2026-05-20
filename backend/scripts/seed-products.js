const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../config.env' });

// ── Models ──
const Category = require('../models/catogeryModel');
const Brand = require('../models/brandModel ');
const SubCategory = require('../models/subCategoryModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// ── Seed Data ──

const categories = [
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Home & Living', slug: 'home-living' },
];

const brands = [
  { name: 'Vestige Studio', slug: 'vestige-studio' },
  { name: 'Atelier Moderne', slug: 'atelier-moderne' },
  { name: 'Maison Craft', slug: 'maison-craft' },
];

const subCategories = [
  { name: 'Outerwear', slug: 'outerwear', categoryIndex: 0 },
  { name: 'Dresses', slug: 'dresses', categoryIndex: 0 },
  { name: 'Tops', slug: 'tops', categoryIndex: 0 },
  { name: 'Bottoms', slug: 'bottoms', categoryIndex: 0 },
  { name: 'Jewelry', slug: 'jewelry', categoryIndex: 1 },
  { name: 'Bags', slug: 'bags', categoryIndex: 1 },
  { name: 'Scarves', slug: 'scarves', categoryIndex: 1 },
  { name: 'Decor', slug: 'decor', categoryIndex: 2 },
];

const productsData = [
  {
    title: 'Structured Wool Blazer',
    description: 'A beautifully structured wool blazer that elevates any outfit. Crafted from premium Italian wool with a tailored silhouette and subtle texture.',
    price: 420,
    priceAfterDiscount: 350,
    quantity: 25,
    colors: ['#1A1A1A', '#4A4A4A', '#8B7355'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiQNFXL2ANS9D0OJQ6oY7FqWQOS4lmQef2qjwvuOSpx7jMyfw749Hz3A5iuyJPEKFHS57UPnQSSW1gqMgEzKYJHpI7BbhVGnJVZGTKrLJkF_tNCyuDZNngpVUwvFKjpxaWWC9mVtlAwCwvGNspsG5cxfFweqQqjaQ0ufmY47PBqKO94n8bm7jywsoemj9UCq6C9bmquO-iXDYAcPJG1LCOFDLdxb5kRMeukGKdeUH8AEdCsFa0GXW_fN776TcvTaMYYGgat8vfwNY',
    categoryIndex: 0,
    subCategoryIndex: 0,
    brandIndex: 0,
    ratingsAverage: 4.8,
    ratingsQuantity: 24,
  },
  {
    title: 'Draped Silk Midi Dress',
    description: 'An ethereal silk midi dress with elegant draping and a flowing silhouette. Perfect for both daytime sophistication and evening glamour.',
    price: 580,
    quantity: 15,
    colors: ['#F5F0E8', '#2C2C2C', '#8B4F65'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApo-C0sfCRCKDXznGHvH3_XbRSK0kg9aVUkL1lIRQ8GhNPskGqnubzBZ8shR94_XHh_E19-_eiRBLJJPkjYi9tS4KVVcZzuPBgUOHdPthVbd_GucSJL3UYvJ4tByVHylyydXJwf7hyXXx98-BG-4jvpdQShvkqXHs3VZDugXFbWyHWp0kxnLcMHRr6FQUFjPS9VTbQxuKx13Y4gR20WWBPb5M3yyDyeQWTfjHj0g5vZFzb34JFTlNjH5jK7pnZndcuPftyR6-3Z1E',
    categoryIndex: 0,
    subCategoryIndex: 1,
    brandIndex: 1,
    ratingsAverage: 4.9,
    ratingsQuantity: 31,
  },
  {
    title: 'Architectural Leather Tote',
    description: 'A structured leather tote with clean geometric lines and premium full-grain leather. Spacious interior with organized compartments for everyday essentials.',
    price: 340,
    priceAfterDiscount: 290,
    quantity: 30,
    colors: ['#2C2C2C', '#8B7355', '#F5F0E8'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDr9J81ffoVRdywQE6Tv4433Aaa2N9wzmOKw5kxWJ-Xjpf4U2rsSgHLz9NdMHCQ0qwbkuGxoOAbBZKSQuM5nZxTRQoCkpv1iGNgO-AvK5Y6Yi7GnhSt8wjcVIosZIQOubhRWNU_18XoVIpvS6j5cgnmAzLwvVEq_Jn-ZBNUKr1SDhqnLwV8n0PQwqL7WJqImlUb7r4dzmcVjMrabIg6GBS-oY8gAmZzWXbWfeuCm4HdeIxqsLr2UFEMphOqo5nuN7B6RCAay34MmI',
    categoryIndex: 1,
    subCategoryIndex: 5,
    brandIndex: 2,
    ratingsAverage: 4.7,
    ratingsQuantity: 18,
  },
  {
    title: 'Brushed Gold Statement Cuff',
    description: 'A bold brushed gold cuff bracelet with an organic sculptural form. Hand-finished with a matte texture that catches light beautifully.',
    price: 195,
    quantity: 40,
    colors: ['#C5A55A', '#E8E0D0'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg_hv73pzKiH7nulFTtDwyy2AUDZNZw4kLWcGUapwqUflDwrnp_3ZtEALpnM1DYx7bw16F9JPFcgRkQEqK9Aj09xsKL00-1Y5qIfY-Og9DuX8IPmx3VONfmdKgabyUnRKq8f9paBgTvN-1waibUtrFvzhzLTPYSQPuCxNRV493ncMFSzDSmEFFRcq39EGb8M_IVrdwXrqQkk5XWn62B8LUqggFx8_bQrMMM2AOxjF1PJBkm09xo0vGgtKljmx-cWzz2l1iS3IwlGs',
    categoryIndex: 1,
    subCategoryIndex: 4,
    brandIndex: 1,
    ratingsAverage: 4.6,
    ratingsQuantity: 12,
  },
  {
    title: 'Textured Ceramic Vase',
    description: 'A hand-thrown ceramic vase with organic texture and a matte glaze finish. Each piece is unique, bringing artisanal warmth to contemporary interiors.',
    price: 120,
    quantity: 50,
    colors: ['#F5F0E8', '#C4B39A'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqTpu-FiuszM3NEzoMKO0VFmJZhkLX8xR493OAuuFdgZWcF6rgDkaQsVtzDi57a35KPBqltJM6FseAIadRD1mogVc26q0Z3lFoNdL5WhYmhWCi2IdxwVw2gN2gcOebb-xciB1n0kxuZjSwlflSth6AzEb-Syv1T6X-9f3pih9NJXP2_sCjmWe6x6g9RI5rwML-ATQ8l4sIOtHiuQOw5xyDpPkTDDP6QwWMJCFzAcRZjVDVmF8vVRXED66MH35s6Qwv8vxl4dsQrgA',
    categoryIndex: 2,
    subCategoryIndex: 7,
    brandIndex: 2,
    ratingsAverage: 4.5,
    ratingsQuantity: 9,
  },
  {
    title: 'Silk Trench Coat',
    description: 'A luxurious silk-blend trench coat with a fluid drape and modern proportions. Features a belted waist and structured collar for timeless elegance.',
    price: 750,
    priceAfterDiscount: 625,
    quantity: 10,
    colors: ['#C4B39A', '#2C2C2C'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATfBiQSeoa-ilA0ryUV-QkMqxuY8PcRVPCAY3D5CB66YWUJKJuURiIxZkxQl1VNhkpzmnjXZuftia2DsoM7bLotV_xFCSdOJQRJSb1ScXwveQJe8Jv4QjC9-8AgPK3Io3CRhlT5fAn8TGw5Hqvhv71tZS90resgR1VIweWgTdix-pDKRst8EHyfl4AHOHZcKKU78mlj-cCKdfKv7BIoSkMog8F5l997dpFEwb-uJ30BN0pSCXKRBENzBW2HcnBul3LFXfAox31AzE',
    categoryIndex: 0,
    subCategoryIndex: 0,
    brandIndex: 0,
    ratingsAverage: 5.0,
    ratingsQuantity: 7,
  },
  {
    title: 'Long-Sleeve Knit Sweater',
    description: 'A relaxed-fit knit sweater crafted from soft merino wool. Features ribbed cuffs and hem with a subtle textured pattern throughout.',
    price: 280,
    quantity: 35,
    colors: ['#F5F0E8', '#4A4A4A', '#7B6B5A'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgZxkxJCDqFcO15kPkejozEKZWJywgYA1H54NMeZKU_KZmbYeXqOi6DgBCZUgNIfTzreN_x7U1vHySzgX9ZGN3oLFE9chAMMaHA3agbAi4TaV7MfefE6tWQYmHGDLUstpZ3ifgh02VKoKWwLlGHndqRSBYLf55KcpCHK4vm-RfB1p_HSSTZokwscIqZ0nqLFZw3lHOHSWy640praWukB2rZJO9iQwbsG6o64gWyCHtboXDQzrPJ5xB4WZrgACnyDbBRdkW9ZSojdU',
    categoryIndex: 0,
    subCategoryIndex: 2,
    brandIndex: 1,
    ratingsAverage: 4.4,
    ratingsQuantity: 22,
  },
  {
    title: 'Oversized Poplin Shirt',
    description: 'A crisp oversized poplin shirt with a contemporary boxy silhouette. Made from organic cotton with mother-of-pearl buttons and a clean placket.',
    price: 185,
    quantity: 45,
    colors: ['#FFFFFF', '#B0C4DE', '#2C2C2C'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiuBX8b8LMlhzKKTddvn5-jovrB86o4x-c4-6abKSUQkl4I5vkrEowTbxe815kUOJbzBqmkZ9DixgoEJDfVBUh-38Bf11_KUsCM6D0aYsLENfPLVfXcaCxH0ft_8EWp4BuqOiArxzLcMmBoQl0F3jHd0FxHFuKb99WhpWSJ2GocazGALj6dFVjKJUBYxQ77oajAKmcbny851G3jkEvOcq2168ANv2ZTZnzl3K_xQMytIFRscgqTG6Js-oSkqJad6XailgoCEUKGKk',
    categoryIndex: 0,
    subCategoryIndex: 2,
    brandIndex: 2,
    ratingsAverage: 4.3,
    ratingsQuantity: 15,
  },
  {
    title: 'Tailored Wide-Leg Trousers',
    description: 'Impeccably tailored wide-leg trousers with a high waist and flowing drape. A versatile staple that transitions seamlessly from office to evening.',
    price: 310,
    quantity: 20,
    colors: ['#2C2C2C', '#4A4A4A', '#C4B39A'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANxj125L5LMGuOXUbzBWLEvPl7rjpfNMdxHi5-gQ48ifilZneLULlF3jeu0UKr_N5uGFNUYL6ZuME-TmoLhY7ZotFMl66Jb66dshRQgUfKfLhVv6bmsEX0dpIXRPX34FDUinyqrGoy8VUzWf29l6gNPPBvzkTYEky5PNyFnfO-n79C42-Rw3DwaLJq_rHWhhXR52v7Vqn2Cg1-Tiiixcvqsy2jysnv5jjp3b0r8xNlLBFlyVOTi43ryfCHqTUTVyUNyzVSkF5_qPo',
    categoryIndex: 0,
    subCategoryIndex: 3,
    brandIndex: 0,
    ratingsAverage: 4.7,
    ratingsQuantity: 19,
  },
  {
    title: 'Sheer Cashmere Scarf',
    description: 'An ultra-lightweight cashmere scarf with a delicate sheer weave. Luxuriously soft and warm, perfect for layering across seasons.',
    price: 160,
    quantity: 55,
    colors: ['#F5F0E8', '#C4B39A', '#8B4F65'],
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHriNKRXQrpEc_7V0Ry-ZTHYllR8kaXImq_BCq5AWWS2dgSeGe9T64nCgGUADwDEKSnNVxx_lPKlHlUJcYR8PlSThQZ47mwKyNzMqL2GtleT90eta_aY2LKOTsoJ7TIHcytUikilB99d0lspBmgFnuSVSALMJ4pZ1zmdG0rZb6iR0a5eOb2U3YBcTkD-Vab81TMali2CtfoeVYte_t_KbKki2d2ayVLSax_sfjUJJap1SBvJYy1ZRTAY3y676w02SKHMGGRZbv_Nk',
    categoryIndex: 1,
    subCategoryIndex: 6,
    brandIndex: 1,
    ratingsAverage: 4.6,
    ratingsQuantity: 14,
  },
];

// ── Admin user ──
const adminUser = {
  name: 'Fahd Azmy',
  email: 'admin@modernstore.com',
  password: 'Admin@123',
  role: 'admin',
};

// ── Main Seed Function ──

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Brand.deleteMany({}),
      SubCategory.deleteMany({}),
      Product.deleteMany({}),
    ]);

    // 1. Create Categories
    console.log('\n📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    createdCategories.forEach((c) => console.log(`   ✅ ${c.name}`));

    // 2. Create Brands
    console.log('\n🏷️  Creating brands...');
    const createdBrands = await Brand.insertMany(brands);
    createdBrands.forEach((b) => console.log(`   ✅ ${b.name}`));

    // 3. Create Subcategories (with parent category references)
    console.log('\n📂 Creating subcategories...');
    const subCatsToInsert = subCategories.map((sc) => ({
      name: sc.name,
      slug: sc.slug,
      catogery: createdCategories[sc.categoryIndex]._id,
    }));
    const createdSubCategories = await SubCategory.insertMany(subCatsToInsert);
    createdSubCategories.forEach((sc) => console.log(`   ✅ ${sc.name}`));

    // 4. Create Products
    console.log('\n🛍️  Creating products...');
    for (const p of productsData) {
      const product = await Product.create({
        title: p.title,
        slug: slugify(p.title, { lower: true }),
        description: p.description,
        price: p.price,
        priceAfterDiscount: p.priceAfterDiscount,
        quantity: p.quantity,
        colors: p.colors,
        imageCover: p.imageCover,
        category: createdCategories[p.categoryIndex]._id,
        Subcategory: createdSubCategories[p.subCategoryIndex]._id,
        brand: createdBrands[p.brandIndex]._id,
        ratingsAverage: p.ratingsAverage,
        ratingsQuantity: p.ratingsQuantity,
      });
      console.log(`   ✅ ${product.title} — $${product.price}`);
    }

    // 5. Create Admin User (if not exists)
    console.log('\n👤 Creating admin user...');
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create({
        name: adminUser.name,
        email: adminUser.email,
        password: adminUser.password,
        role: adminUser.role,
      });
      console.log(`   ✅ Admin created: ${adminUser.email} / ${adminUser.password}`);
    } else {
      console.log(`   ℹ️  Admin already exists: ${adminUser.email}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`   📊 ${createdCategories.length} categories`);
    console.log(`   📊 ${createdBrands.length} brands`);
    console.log(`   📊 ${createdSubCategories.length} subcategories`);
    console.log(`   📊 ${productsData.length} products`);
    console.log(`   📊 1 admin user\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
