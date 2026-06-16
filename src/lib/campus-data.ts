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
  avgPrep: number; // minutes
  queue: number; // people currently in queue
  open: boolean;
  rewardsRate: number; // Campus Coins per ₹100
  tags: string[];
};

export type MenuItem = {
  id: string;
  vendorId: string;
  name: string;
  desc: string;
  price: number;
  prep: number;
  image: string;
  category: string;
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
});

const barbers: Vendor[] = [
  {
    id: "hall-2-barber",
    name: "Hall 2 Barber",
    kind: "barber",
    location: "Hall 2 · Basement",
    image: coffeeImg,
    tagline: "Classic cuts & shaves",
    rating: 4.4,
    reviews: 312,
    avgPrep: 20,
    queue: 3,
    open: true,
    rewardsRate: 3,
    tags: ["Haircut", "Beard"],
  },
  {
    id: "old-shop-barber",
    name: "Old Shop Barber",
    kind: "barber",
    location: "Behind Main Library",
    image: deliImg,
    tagline: "Since 1987 · campus legend",
    rating: 4.7,
    reviews: 904,
    avgPrep: 25,
    queue: 7,
    open: true,
    rewardsRate: 2,
    tags: ["Haircut", "Hot Towel"],
  },
  {
    id: "main-gate-barber",
    name: "Main Gate Barber",
    kind: "barber",
    location: "Main Gate Plaza",
    image: noodleImg,
    tagline: "Walk-ins welcome",
    rating: 4.2,
    reviews: 188,
    avgPrep: 18,
    queue: 2,
    open: false,
    rewardsRate: 2,
    tags: ["Haircut", "Styling"],
  },
];

export const vendors: Vendor[] = [...canteens, ...barbers];

export const getVendor = (id: string) => vendors.find((v) => v.id === id);

const baseFoodItems = [
  { name: "Veg Thali", desc: "Dal, sabzi, roti, rice, salad.", price: 80, prep: 8, image: sandwichImg, category: "Meals" },
  { name: "Masala Dosa", desc: "Crispy dosa, potato masala, sambar.", price: 60, prep: 7, image: grilledcheeseImg, category: "Meals" },
  { name: "Cold Coffee", desc: "Iced, frothy, sweet.", price: 50, prep: 3, image: coffeeItemImg, category: "Drinks" },
  { name: "Paneer Roll", desc: "Spicy paneer wrapped in flaky paratha.", price: 70, prep: 6, image: pokebowlImg, category: "Snacks" },
  { name: "French Fries", desc: "Salt, pepper, ketchup.", price: 50, prep: 5, image: friesImg, category: "Snacks" },
  { name: "Gulab Jamun", desc: "Two pieces, warm.", price: 30, prep: 2, image: dessertImg, category: "Desserts" },
];

const barberServices = [
  { name: "Haircut", desc: "Classic scissor cut.", price: 80, prep: 20, image: coffeeImg, category: "Services" },
  { name: "Beard Trim", desc: "Shape & line up.", price: 50, prep: 10, image: deliImg, category: "Services" },
  { name: "Hot Towel Shave", desc: "Full shave, hot towel finish.", price: 120, prep: 25, image: noodleImg, category: "Services" },
];

export const menuByVendor = (id: string): MenuItem[] => {
  const v = getVendor(id);
  if (!v) return [];
  const source = v.kind === "barber" ? barberServices : baseFoodItems;
  return source.map((s, i) => ({
    id: `${id}-${i}`,
    vendorId: id,
    name: s.name,
    desc: s.desc,
    price: s.price,
    prep: s.prep,
    image: s.image,
    category: s.category,
  }));
};

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

// Carousel category rows for the user dashboard. Each row picks vendors
// from the master `vendors` list using a simple predicate so it stays
// data-driven and easy to swap with a real backend query.
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
