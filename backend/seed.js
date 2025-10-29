const mongoose = require('mongoose');
require('dotenv').config();

const Experience = require('./models/Experience');
const PromoCode = require('./models/PromoCode');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookit';

const experiences = [
  {
    title: "Kayaking",
    location: "Udupi",
    image: "/kayaking-in-river.jpg",
    price: 999,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "07:00 am", available: 4 },
      { time: "9:00 am", available: 2 },
      { time: "11:00 am", available: 5 },
      { time: "1:00 pm", available: 0, status: "sold-out" }
    ],
    about: "Scenic routes, trained guides, and safety briefing. Minimum age 10.",
    taxes: 59
  },
  {
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    image: "/sunrise-at-nandi-hills.jpg",
    price: 899,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "05:00 am", available: 6 },
      { time: "05:30 am", available: 3 }
    ],
    about: "Early morning trek to catch the sunrise. Transportation included.",
    taxes: 50
  },
  {
    title: "Coffee Trail",
    location: "Coorg",
    image: "/coffee-plantation-trail.jpg",
    price: 1299,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "08:00 am", available: 8 },
      { time: "10:00 am", available: 5 },
      { time: "02:00 pm", available: 4 }
    ],
    about: "Walk through coffee plantations, learn about coffee processing, and enjoy fresh brews.",
    taxes: 70
  },
  {
    title: "Kayaking",
    location: "Idukki Karakala",
    image: "/kayaking-adventure.png",
    price: 999,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "07:00 am", available: 4 },
      { time: "9:00 am", available: 2 },
      { time: "11:00 am", available: 5 },
      { time: "1:00 pm", available: 0, status: "sold-out" }
    ],
    about: "Scenic routes, trained guides, and safety briefing. Minimum age 10.",
    taxes: 59
  },
  {
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    image: "/serene-sunrise-landscape.png",
    price: 899,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "05:00 am", available: 6 },
      { time: "05:30 am", available: 3 }
    ],
    about: "Early morning trek to catch the sunrise. Transportation included.",
    taxes: 50
  },
  {
    title: "Boat Cruise",
    location: "Sagarikula",
    image: "/boat-cruise-on-water.jpg",
    price: 899,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "06:00 pm", available: 10 },
      { time: "07:00 pm", available: 8 }
    ],
    about: "Relaxing evening boat cruise with scenic views.",
    taxes: 50
  },
  {
    title: "Bunjee Jumping",
    location: "Marali",
    image: "/bungee-jumping-adventure.jpg",
    price: 999,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "09:00 am", available: 3 },
      { time: "11:00 am", available: 2 },
      { time: "02:00 pm", available: 4 }
    ],
    about: "Adrenaline-pumping bungee jump experience with certified instructors.",
    taxes: 59
  },
  {
    title: "Coffee Trail",
    location: "Coorg",
    image: "/coffee-trail-forest.jpg",
    price: 1299,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
    dates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
    times: [
      { time: "08:00 am", available: 8 },
      { time: "10:00 am", available: 5 },
      { time: "02:00 pm", available: 4 }
    ],
    about: "Walk through coffee plantations, learn about coffee processing, and enjoy fresh brews.",
    taxes: 70
  }
];

const promoCodes = [
  {
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 500,
    maxDiscount: 200,
    usageLimit: 100,
    isActive: true
  },
  {
    code: "FLAT100",
    discountType: "fixed",
    discountValue: 100,
    minPurchase: 1000,
    usageLimit: 50,
    isActive: true
  },
  {
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    minPurchase: 0,
    maxDiscount: 500,
    usageLimit: null,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Experience.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert experiences
    const insertedExperiences = await Experience.insertMany(experiences);
    console.log(`✅ Inserted ${insertedExperiences.length} experiences`);

    // Insert promo codes
    const insertedPromoCodes = await PromoCode.insertMany(promoCodes);
    console.log(`✅ Inserted ${insertedPromoCodes.length} promo codes`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nAvailable Promo Codes:');
    promoCodes.forEach(promo => {
      console.log(`  - ${promo.code}: ${promo.discountType === 'percentage' ? promo.discountValue + '%' : '₹' + promo.discountValue} off`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
