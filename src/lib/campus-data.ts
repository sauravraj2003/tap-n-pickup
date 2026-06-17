// Campus-specific dummy vendor data. Structured so it can be replaced with
// a backend fetch later — see VendorRecord shape.
import deliImg from "@/assets/canteen-deli.jpg";
import coffeeImg from "@/assets/canteen-coffee.jpg";
import noodleImg from "@/assets/canteen-noodle.jpg";
import bowlsImg from "@/assets/canteen-bowls.jpg";
import sandwichImg from "@/assets/food-sandwich.jpg";
import grilledcheeseImg from "@/assets/item-grilledcheese.jpg";
import pokebowlImg from "@/assets/item-pokebowl.jpg";
import coffeeItemImg from "@/assets/item-coffee.jpg";
import dessertImg from "@/assets/item-dessert.jpg";
import friesImg from "@/assets/item-fries.jpg";

export type VendorKind = "canteen" | "barber";

export type Vendor = {
  id: string;
  name: string;
  kind: VendorKind;
  location: string;
  image: string;
  tagline: string;
  rating: number;
  reviews: number;
  avgPrep: number;
  queue: number;
  open: boolean;
  rewardsRate: number;
  tags: string[];
  lat: number;
  lng: number;
};

export type MenuItem = {
  id: string;
  vendorId: string;
  vendorName?: string;
  name: string;
  desc: string;
  price: number;
  prep: number;
  image: string;
  category: string;
  popularity?: number;
  rating?: number;
};

const canteenImgs = [deliImg, coffeeImg, noodleImg, bowlsImg];
const cuisines = [
  ["North Indian", "Snacks"],
  ["South Indian", "Beverages"],
  ["Chinese", "Noodles"],
  ["Continental", "Sandwiches"],
  ["Punjabi", "Thali"],
  ["Bakery", "Coffee"],
];

// Deterministic spread of vendor pins around a mock campus center.
const CAMPUS_LAT = 22.3149;
const CAMPUS_LNG = 87.3105;
function pinFor(i: number): { lat: number; lng: number } {
  const angle = (i * 137.5) * (Math.PI / 180);
  const r = 0.004 + (i % 5) * 0.0015;
  return { lat: CAMPUS_LAT + Math.sin(angle) * r, lng: CAMPUS_LNG + Math.cos(angle) * r };
}

const canteens: Vendor[] = Array.from({ length: 14 }, (_, i) => {
  const num = i + 1;
  return {
    id: `hall-${num}-canteen`,
    name: `Hall ${num} Canteen`,
    kind: "canteen",
    location: `Hall ${num} · Ground Floor`,
    image: canteenImgs[i % canteenImgs.length],
    tagline: ["Home-style meals", "Quick bites & chai", "Late-night menu", "Famous for paratha"][i % 4],
    rating: +(3.8 + ((i * 7) % 12) / 10).toFixed(1),
    reviews: 120 + i * 47,
    avgPrep: 8 + ((i * 3) % 14),
    queue: (i * 3) % 9,
    open: i % 7 !== 0,
    rewardsRate: 2 + (i % 4),
    tags: cuisines[i % cuisines.length],
    ...pinFor(i),
  };
});

canteens.push({
  id: "mama-mio",
  name: "Mama Mio",
  kind: "canteen",
  location: "Food Court · Block C",
  image: bowlsImg,
  tagline: "Wood-fired pizzas & pasta",
  rating: 4.6,
  reviews: 1820,
  avgPrep: 18,
  queue: 6,
  open: true,
  rewardsRate: 5,
  tags: ["Italian", "Pizza"],
  ...pinFor(15),
});

const barbers: Vendor[] = [
  { id: "hall-2-barber", name: "Hall 2 Barber", kind: "barber", location: "Hall 2 · Basement", image: coffeeImg, tagline: "Classic cuts & shaves", rating: 4.4, reviews: 312, avgPrep: 20, queue: 3, open: true, rewardsRate: 3, tags: ["Haircut", "Beard"], ...pinFor(20) },
  { id: "old-shop-barber", name: "Old Shop Barber", kind: "barber", location: "Behind Main Library", image: deliImg, tagline: "Since 1987 · campus legend", rating: 4.7, reviews: 904, avgPrep: 25, queue: 7, open: true, rewardsRate: 2, tags: ["Haircut", "Hot Towel"], ...pinFor(22) },
  { id: "main-gate-barber", name: "Main Gate Barber", kind: "barber", location: "Main Gate Plaza", image: noodleImg, tagline: "Walk-ins welcome", rating: 4.2, reviews: 188, avgPrep: 18, queue: 2, open: false, rewardsRate: 2, tags: ["Haircut", "Styling"], ...pinFor(24) },
];

export const vendors: Vendor[] = [...canteens, ...barbers];
export const getVendor = (id: string) => vendors.find((v) => v.id === id);

// Expanded menu catalog used by per-vendor menu and the cross-vendor Collections.
const foodCatalog: Omit<MenuItem, "id" | "vendorId">[] = [
  { name: "Veg Thali", desc: "Dal, sabzi, roti, rice, salad.", price: 80, prep: 8, image: sandwichImg, category: "Lunch" },
  { name: "Masala Dosa", desc: "Crispy dosa, potato masala, sambar.", price: 60, prep: 7, image: grilledcheeseImg, category: "Breakfast" },
  { name: "Idli Sambar", desc: "Steamed rice cakes with sambar.", price: 40, prep: 5, image: grilledcheeseImg, category: "Breakfast" },
  { name: "Aloo Paratha", desc: "Stuffed flatbread with butter.", price: 45, prep: 6, image: sandwichImg, category: "Breakfast" },
  { name: "Maggi Masala", desc: "Classic two-minute, hostel-style.", price: 35, prep: 4, image: friesImg, category: "Maggi" },
  { name: "Cheese Maggi", desc: "Loaded with melted cheese.", price: 55, prep: 5, image: friesImg, category: "Maggi" },
  { name: "Veg Maggi Bowl", desc: "Capsicum, onion, tomato, spice.", price: 50, prep: 5, image: friesImg, category: "Maggi" },
  { name: "Cold Coffee", desc: "Iced, frothy, sweet.", price: 50, prep: 3, image: coffeeItemImg, category: "Coffee" },
  { name: "Hot Cappuccino", desc: "Double shot, foamed milk.", price: 70, prep: 4, image: coffeeItemImg, category: "Coffee" },
  { name: "Filter Coffee", desc: "South Indian decoction.", price: 30, prep: 3, image: coffeeItemImg, category: "Coffee" },
  { name: "Masala Chai", desc: "Cardamom, ginger, full cream.", price: 20, prep: 2, image: coffeeItemImg, category: "Tea" },
  { name: "Lemon Iced Tea", desc: "Refreshing summer drink.", price: 40, prep: 2, image: coffeeItemImg, category: "Tea" },
  { name: "Green Tea", desc: "Antioxidant boost.", price: 35, prep: 2, image: coffeeItemImg, category: "Tea" },
  { name: "Mango Shake", desc: "Alphonso pulp, full milk.", price: 75, prep: 3, image: coffeeItemImg, category: "Shake" },
  { name: "Banana Shake", desc: "Energy fuel.", price: 60, prep: 3, image: coffeeItemImg, category: "Shake" },
  { name: "Oreo Shake", desc: "Cookies & cream.", price: 90, prep: 4, image: coffeeItemImg, category: "Shake" },
  { name: "Fresh Lime Soda", desc: "Salt or sweet.", price: 30, prep: 2, image: coffeeItemImg, category: "Beverage" },
  { name: "Buttermilk", desc: "Spiced, chilled.", price: 25, prep: 2, image: coffeeItemImg, category: "Beverage" },
  { name: "Paneer Roll", desc: "Spicy paneer in flaky paratha.", price: 70, prep: 6, image: pokebowlImg, category: "Snacks" },
  { name: "French Fries", desc: "Salt, pepper, ketchup.", price: 50, prep: 5, image: friesImg, category: "Fast Food" },
  { name: "Veg Burger", desc: "Crispy patty, fresh veg.", price: 65, prep: 6, image: friesImg, category: "Fast Food" },
  { name: "Cheese Pizza Slice", desc: "Wood-fired, mozzarella.", price: 110, prep: 8, image: pokebowlImg, category: "Fast Food" },
  { name: "Veg Biryani", desc: "Long grain, slow cooked.", price: 120, prep: 10, image: sandwichImg, category: "Dinner" },
  { name: "Dal Khichdi", desc: "Comfort one-pot.", price: 60, prep: 7, image: sandwichImg, category: "Dinner" },
  { name: "Poha", desc: "Light flattened rice.", price: 30, prep: 4, image: sandwichImg, category: "Healthy" },
  { name: "Sprout Salad", desc: "Protein bowl.", price: 55, prep: 3, image: pokebowlImg, category: "Healthy" },
  { name: "Fruit Bowl", desc: "Seasonal cut fruits.", price: 70, prep: 2, image: pokebowlImg, category: "Healthy" },
  { name: "Gulab Jamun", desc: "Two pieces, warm.", price: 30, prep: 2, image: dessertImg, category: "Dessert" },
  { name: "Brownie", desc: "Fudgy with walnuts.", price: 60, prep: 2, image: dessertImg, category: "Dessert" },
  { name: "Ice Cream Cup", desc: "Vanilla or chocolate.", price: 40, prep: 1, image: dessertImg, category: "Dessert" },
];

const barberServices = [
  { name: "Haircut", desc: "Classic scissor cut.", price: 80, prep: 20, image: coffeeImg, category: "Services" },
  { name: "Beard Trim", desc: "Shape & line up.", price: 50, prep: 10, image: deliImg, category: "Services" },
  { name: "Hot Towel Shave", desc: "Full shave, hot towel finish.", price: 120, prep: 25, image: noodleImg, category: "Services" },
];

export const menuByVendor = (id: string): MenuItem[] => {
  const v = getVendor(id);
  if (!v) return [];
  if (v.kind === "barber") {
    return barberServices.map((s, i) => ({ ...s, id: `${id}-${i}`, vendorId: id, vendorName: v.name }));
  }
  // Rotate slice of catalog per vendor so menus differ.
  const offset = (parseInt(id.replace(/\D/g, "") || "0") * 3) % foodCatalog.length;
  const slice = [...foodCatalog.slice(offset), ...foodCatalog.slice(0, offset)].slice(0, 12);
  return slice.map((s, i) => ({ ...s, id: `${id}-${i}`, vendorId: id, vendorName: v.name, popularity: ((i + offset) * 17) % 100, rating: +(3.5 + ((i + offset) % 15) / 10).toFixed(1) }));
};

// Flat menu across every canteen — used by Collections pages.
export const allMenuItems: MenuItem[] = vendors
  .filter((v) => v.kind === "canteen")
  .flatMap((v) => menuByVendor(v.id));

export const collections = [
  { id: "must-try", title: "Must-Try This Week", subtitle: "Trending across campus", filter: (v: Vendor) => v.rating >= 4.5 },
  { id: "quickest", title: "Quickest Queues", subtitle: "Get in, get out", filter: (v: Vendor) => v.queue <= 3 && v.open },
  { id: "hidden-gems", title: "Hidden Gems", subtitle: "Low reviews, high quality", filter: (v: Vendor) => v.reviews < 300 },
];

export const userFilters = [
  { id: "shortest-wait", label: "Shortest Wait" },
  { id: "open-now", label: "Open Now" },
  { id: "high-rewards", label: "High Rewards" },
  { id: "quick-prep", label: "Quick Prep" },
];

export const ratingFilters = [
  { id: "any", label: "All Ratings", min: 0 },
  { id: "r2", label: "2★ & Above", min: 2 },
  { id: "r3", label: "3★ & Above", min: 3 },
  { id: "r4", label: "4★ & Above", min: 4 },
];

export const carouselCategories: { id: string; title: string; subtitle: string; pick: (v: Vendor) => boolean }[] = [
  { id: "popular-near-you", title: "Popular Near You", subtitle: "Trending within 5 minutes walk", pick: (v) => v.reviews > 300 && v.open },
  { id: "best-rated", title: "Best Rated", subtitle: "Top-rated by students", pick: (v) => v.rating >= 4.4 },
  { id: "breakfast", title: "Breakfast", subtitle: "Start your day right", pick: (v) => v.tags.some((t) => /south indian|bakery|coffee|snacks/i.test(t)) },
  { id: "lunch", title: "Lunch Specials", subtitle: "Hearty midday meals", pick: (v) => v.tags.some((t) => /thali|north indian|punjabi|continental/i.test(t)) },
  { id: "snacks", title: "Snacks", subtitle: "Quick bites between classes", pick: (v) => v.tags.some((t) => /snacks|sandwiches|noodles/i.test(t)) },
  { id: "beverages", title: "Beverages", subtitle: "Chai, coffee & coolers", pick: (v) => v.tags.some((t) => /beverages|coffee/i.test(t)) },
  { id: "healthy", title: "Healthy Options", subtitle: "Light, fresh & balanced", pick: (v) => v.avgPrep <= 12 && v.rating >= 4.0 },
  { id: "recommended", title: "Recommended For You", subtitle: "Picked based on campus favorites", pick: (v) => v.rewardsRate >= 3 && v.open },
];

// ---- COLLECTIONS (price + category) ----
export type FoodCollection = {
  slug: string;
  title: string;
  subtitle: string;
  kind: "price" | "category";
  // Filter for MenuItem
  filter: (m: MenuItem) => boolean;
};

export const priceCollections: FoodCollection[] = [
  { slug: "under-50", title: "Under ₹50", subtitle: "Pocket-friendly picks", kind: "price", filter: (m) => m.price <= 50 },
  { slug: "under-80", title: "Under ₹80", subtitle: "Budget meals & combos", kind: "price", filter: (m) => m.price <= 80 },
  { slug: "under-100", title: "Under ₹100", subtitle: "Filling plates under a hundred", kind: "price", filter: (m) => m.price <= 100 },
  { slug: "under-120", title: "Under ₹120", subtitle: "A little treat", kind: "price", filter: (m) => m.price <= 120 },
  { slug: "under-150", title: "Under ₹150", subtitle: "Premium picks", kind: "price", filter: (m) => m.price <= 150 },
];

const cat = (slug: string, title: string, subtitle: string, match: RegExp): FoodCollection => ({
  slug,
  title,
  subtitle,
  kind: "category",
  filter: (m) => match.test(m.category) || match.test(m.name),
});

export const categoryCollections: FoodCollection[] = [
  cat("maggi", "Maggi Collection", "From classic to cheesy", /maggi/i),
  cat("shake", "Shake Collection", "Thick & frosty", /shake/i),
  cat("beverage", "Beverage Collection", "Chilled, fizzy, fresh", /beverage|lemon|buttermilk/i),
  cat("coffee", "Coffee Collection", "From filter to frappé", /coffee/i),
  cat("tea", "Tea Collection", "Chai & specialty teas", /tea|chai/i),
  cat("breakfast", "Breakfast Collection", "Start your day", /breakfast/i),
  cat("lunch", "Lunch Collection", "Heavy midday meals", /lunch|thali/i),
  cat("dinner", "Dinner Collection", "End the day right", /dinner|biryani/i),
  cat("snacks", "Snacks Collection", "Between-class bites", /snack/i),
  cat("healthy", "Healthy Food Collection", "Light & balanced", /healthy/i),
  cat("fast-food", "Fast Food Collection", "Pizza · burger · fries", /fast food|burger|pizza|fries/i),
  cat("dessert", "Dessert Collection", "Sweet endings", /dessert|brownie|ice cream/i),
];

export const allCollections: FoodCollection[] = [...priceCollections, ...categoryCollections];
export const getCollection = (slug: string) => allCollections.find((c) => c.slug === slug);
