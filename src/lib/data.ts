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

export type Canteen = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  wait: number; // minutes
  open: boolean;
  hours: string;
  popular: string[];
  tags: string[];
};

export const canteens: Canteen[] = [
  {
    id: "artisan-deli",
    name: "The Artisan Deli",
    tagline: "Hand-pressed sandwiches & rye loaves",
    image: deliImg,
    rating: 4.8,
    reviews: 2143,
    distance: "0.4 km",
    wait: 12,
    open: true,
    hours: "8:00 — 21:00",
    popular: ["Smoked Pastrami", "Truffle Grilled Cheese"],
    tags: ["Sandwiches", "Bakery"],
  },
  {
    id: "brew-batch",
    name: "Brew & Batch",
    tagline: "Specialty espresso & morning pastries",
    image: coffeeImg,
    rating: 4.6,
    reviews: 941,
    distance: "1.2 km",
    wait: 5,
    open: true,
    hours: "7:00 — 19:00",
    popular: ["Flat White", "Almond Croissant"],
    tags: ["Coffee", "Bakery"],
  },
  {
    id: "noodle-room",
    name: "Noodle Room",
    tagline: "Hand-pulled ramen, daily broths",
    image: noodleImg,
    rating: 4.7,
    reviews: 1322,
    distance: "0.8 km",
    wait: 18,
    open: true,
    hours: "11:00 — 22:00",
    popular: ["Tonkotsu", "Spicy Miso"],
    tags: ["Asian", "Noodles"],
  },
  {
    id: "harvest-bowls",
    name: "Harvest Bowls",
    tagline: "Seasonal grain & poke bowls",
    image: bowlsImg,
    rating: 4.5,
    reviews: 612,
    distance: "0.9 km",
    wait: 9,
    open: false,
    hours: "10:00 — 16:00",
    popular: ["Salmon Poke", "Kale Caesar"],
    tags: ["Healthy", "Bowls"],
  },
];

export type Item = {
  id: string;
  canteenId: string;
  name: string;
  desc: string;
  price: number;
  prep: number;
  category: "Snacks" | "Meals" | "Drinks" | "Desserts";
  image: string;
};

export const items: Item[] = [
  { id: "pastrami", canteenId: "artisan-deli", name: "Smoked Pastrami", desc: "Rye, mustard, Swiss, pickles.", price: 12.5, prep: 7, category: "Meals", image: sandwichImg },
  { id: "grilled-cheese", canteenId: "artisan-deli", name: "Truffle Grilled Cheese", desc: "Sourdough, aged cheddar, truffle oil.", price: 10.0, prep: 6, category: "Meals", image: grilledcheeseImg },
  { id: "truffle-fries", canteenId: "artisan-deli", name: "Truffle Fries", desc: "Hand-cut, parmesan, sea salt.", price: 6.5, prep: 4, category: "Snacks", image: friesImg },
  { id: "poke", canteenId: "harvest-bowls", name: "Salmon Poke Bowl", desc: "Sushi-grade salmon, edamame, ginger rice.", price: 14.0, prep: 5, category: "Meals", image: pokebowlImg },
  { id: "flat-white", canteenId: "brew-batch", name: "Flat White", desc: "Double ristretto, silky steamed milk.", price: 4.2, prep: 3, category: "Drinks", image: coffeeItemImg },
  { id: "lava", canteenId: "artisan-deli", name: "Chocolate Lava", desc: "Warm centre, vanilla cream, raspberry.", price: 7.5, prep: 5, category: "Desserts", image: dessertImg },
];

export const itemsByCanteen = (id: string) => items.filter((i) => i.canteenId === id);

export const notifications = [
  { id: "n1", kind: "ready", title: "Order #042 ready", body: "Pick up at Counter 02 — The Artisan Deli", time: "Just now" },
  { id: "n2", kind: "prep", title: "Almost ready", body: "Your order will be ready in 5–10 minutes.", time: "2m ago" },
  { id: "n3", kind: "promo", title: "20% off mornings", body: "Brew & Batch — weekdays before 10am.", time: "1h ago" },
  { id: "n4", kind: "new", title: "New canteen nearby", body: "Harvest Bowls just opened in your area.", time: "Yesterday" },
];

export const orderHistory = [
  { id: "o1", canteen: "The Artisan Deli", items: 2, total: 22.5, status: "Picked up", date: "Today, 12:54" },
  { id: "o2", canteen: "Brew & Batch", items: 1, total: 4.2, status: "Picked up", date: "Yesterday" },
  { id: "o3", canteen: "Noodle Room", items: 3, total: 31.0, status: "Picked up", date: "Mon" },
];
