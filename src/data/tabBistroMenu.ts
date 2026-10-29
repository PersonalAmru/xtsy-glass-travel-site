export interface MenuItem {
  name: string;
  price: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
  /** Add-ons and serving notes printed under this category on the physical menu. */
  note?: string;
}

export interface MenuSection {
  id: string;
  label: string;
  icon: string;
  categories: MenuCategory[];
}

/**
 * TAB Bistro by XTSY — official menu (Flavour. Food. Fusion.)
 *
 * Source of truth: the current printed menu. Item order follows the printed
 * card so the two can be checked against each other line by line.
 *
 * These prices are served to Google as schema.org Offer data via
 * tabBistroSchema.ts, so a stale figure here becomes a wrong price in search
 * results. Update this file whenever the printed menu changes, and nowhere
 * else.
 *
 * Prices are in INR and EXCLUSIVE of GST — see MENU_GST_NOTE.
 */

/** Printed on every page of the menu; show it wherever prices are displayed. */
export const MENU_GST_NOTE = "5% GST is added to the bill amount. Prices are exclusive of GST.";

export const menuSections: MenuSection[] = [
  {
    id: "beverages",
    label: "Beverages",
    icon: "☕",
    categories: [
      {
        title: "Assam Tea & Coffee",
        items: [
          { name: "Black Tea", price: "₹40" },
          { name: "Red Tea", price: "₹40" },
          { name: "Lemon Honey Tea", price: "₹60" },
          { name: "Milk Chai", price: "₹60" },
          { name: "Espresso", price: "₹60" },
          { name: "Cappuccino", price: "₹100" },
        ],
        note: "Sugar / no sugar to your preference. Extra sugar ₹10.",
      },
      {
        title: "Lemonades",
        items: [
          { name: "Fresh Lime (Sweet/Salt)", price: "₹120" },
          { name: "Fresh Lemon Soda (Sweet/Salt)", price: "₹140" },
          { name: "Fresh Lemon Mint", price: "₹160" },
          { name: "Drinking Water 500 ml", price: "₹12" },
          { name: "Drinking Water 1L", price: "₹24" },
        ],
        note: "Drinking water is charged at MRP.",
      },
      {
        title: "Mocktails & Mojitos",
        items: [
          { name: "Virgin Mojito", price: "₹160" },
          { name: "Lychee Fruit Mojito", price: "₹180" },
          { name: "Passion Fruit Mojito", price: "₹180" },
          { name: "Green Apple Mojito", price: "₹180" },
          { name: "Oh Kiwi Rita", price: "₹200" },
          { name: "Piña Colada", price: "₹200" },
          { name: "XTSY Blue Lagoon", price: "₹200" },
          { name: "Awesome Shillong", price: "₹200" },
        ],
      },
      {
        title: "Signature Beverages",
        items: [
          { name: "Chocolate Shake", price: "₹180" },
          { name: "Oreo Shake", price: "₹200" },
          { name: "Cold Coffee", price: "₹200" },
          { name: "Caramel KitKat Shake", price: "₹240" },
          { name: "Strawberry Shake", price: "₹240" },
          { name: "Fruit & Nut Shake", price: "₹280" },
        ],
        note: "Add-ons: choco syrup ₹20, ice cream ₹50, Oreo crunches ₹25.",
      },
    ],
  },
  {
    id: "breakfast",
    label: "Breakfast",
    icon: "🍳",
    categories: [
      {
        title: "Breakfast & Bites",
        items: [
          { name: "North Indian Poha", price: "₹140" },
          { name: "Masala Omelette", price: "₹140" },
          { name: "Aloo Paratha", price: "₹140" },
          { name: "Italian Cheese Omelette", price: "₹160" },
          { name: "Bread Omelette", price: "₹160" },
          { name: "Puri Sabji", price: "₹160" },
          { name: "Egg Dosa", price: "₹160" },
          { name: "Paneer Paratha", price: "₹160" },
          { name: "Mushroom Cheese Omelette", price: "₹180" },
          { name: "Masala Bread Omelette", price: "₹180" },
          { name: "Masala Dosa", price: "₹180" },
          { name: "Chicken Cheese Omelette", price: "₹200" },
          { name: "Pancake with Maple Syrup", price: "₹280" },
          { name: "Pancake with Ice Cream", price: "₹360" },
        ],
      },
      {
        title: "Signature South Indian",
        items: [
          { name: "Kerala Parotta (2 Pcs)", price: "₹100" },
          { name: "Kerala Parotta (2 Pcs) with Chicken Gravy", price: "₹180" },
          { name: "Steamed Rice with Tomato Rasam", price: "₹180" },
          { name: "Steamed Rice with Chicken Kosha", price: "₹280" },
          { name: "Curd Rice with Chicken 65", price: "₹280" },
        ],
      },
    ],
  },
  {
    id: "soups",
    label: "Soups",
    icon: "🍲",
    categories: [
      {
        title: "XTSY Signature Soups",
        items: [
          { name: "Clear Soup (Veg/Non Veg)", price: "₹140" },
          { name: "Lemon Coriander (Veg)", price: "₹160" },
          { name: "Sweet Corn Soup (Veg)", price: "₹160" },
          { name: "Hot & Sour Soup (Veg)", price: "₹160" },
          { name: "Lemon Coriander (Non Veg)", price: "₹180" },
          { name: "Sweet Corn Soup (Non Veg)", price: "₹180" },
          { name: "Hot & Sour Soup (Non Veg)", price: "₹180" },
          { name: "Manchow Soup (Veg)", price: "₹180" },
          { name: "Manchow Soup (Non Veg)", price: "₹200" },
          { name: "Cream of Tomato", price: "₹200" },
        ],
      },
    ],
  },
  {
    id: "appetizers",
    label: "Appetizers",
    icon: "🍗",
    categories: [
      {
        title: "Non Veg Appetizers",
        items: [
          { name: "Crispy Chicken 65", price: "₹260" },
          { name: "Wings of Heaven (6PC/12PC)", price: "₹320/₹640" },
          { name: "Drums of Heaven (6PC/12PC)", price: "₹340/₹680" },
          { name: "Hot Chilli Prawns", price: "₹380" },
          { name: "Prawns Kung Pao", price: "₹380" },
          { name: "Prawns Hot Schezwan", price: "₹380" },
        ],
      },
      {
        title: "Veg Appetizers",
        items: [
          { name: "Paneer Manchurian Dry", price: "₹280" },
          { name: "Paneer Hot Schezwan Dry", price: "₹280" },
          { name: "Paneer Fusion Kung Pao", price: "₹280" },
          { name: "Mushroom Manchurian Dry", price: "₹300" },
          { name: "Mushroom Hot Schezwan Dry", price: "₹300" },
          { name: "Mushroom Kung Pao", price: "₹300" },
        ],
      },
      {
        title: "Tandoori Appetizers",
        items: [
          { name: "Tandoori Paneer Tikka", price: "₹300" },
          { name: "Tandoori Mushroom Tikka", price: "₹300" },
          { name: "Tandoori Malai Broccoli", price: "₹300" },
          { name: "Tandoori Chicken Tikka", price: "₹340" },
          { name: "Tandoori Prawns", price: "₹380" },
          { name: "Tandoori Chicken (Half/Full)", price: "₹380/₹740" },
        ],
      },
    ],
  },
  {
    id: "mains",
    label: "Mains",
    icon: "🍛",
    categories: [
      {
        title: "Indian Gravies — Veg",
        items: [
          { name: "Mixed Vegetable Gravy", price: "₹280" },
          { name: "Matar Mushroom Masala", price: "₹300" },
          { name: "Paneer Butter Masala", price: "₹300" },
          { name: "Kadhai Paneer", price: "₹300" },
          { name: "Paneer Lababdar", price: "₹340" },
        ],
      },
      {
        title: "Indian Gravies — Non Veg",
        items: [
          { name: "Chicken Curry", price: "₹260" },
          { name: "Chicken Butter Masala", price: "₹340" },
          { name: "Kadhai Chicken", price: "₹340" },
          { name: "XTSY Chicken Kosha", price: "₹340" },
          { name: "Chicken Tikka Masala", price: "₹360" },
        ],
      },
      {
        title: "Dal Specials",
        items: [
          { name: "Yellow Dal Tadka", price: "₹240" },
          { name: "XTSY Spl. Dal Makhani", price: "₹280" },
        ],
      },
      {
        title: "Chinese Gravy — Veg",
        items: [
          { name: "Veg Manchurian Gravy", price: "₹280" },
          { name: "Veg Schezwan Gravy", price: "₹280" },
          { name: "Paneer Chilli Gravy", price: "₹280" },
          { name: "Paneer Manchurian Gravy", price: "₹300" },
          { name: "Mushroom Chilli Gravy", price: "₹300" },
          { name: "Mushroom Manchurian Gravy", price: "₹320" },
        ],
      },
      {
        title: "Chinese Gravy — Non Veg",
        items: [
          { name: "Chilli Chicken Gravy", price: "₹320" },
          { name: "Chicken Schezwan Gravy", price: "₹340" },
          { name: "Chicken Manchurian Gravy", price: "₹340" },
          { name: "Chicken Cheese Manchurian Gravy", price: "₹360" },
          { name: "Honey Chilli Chicken Gravy", price: "₹380" },
          { name: "Chef's Special Chicken Gravy", price: "₹380" },
        ],
      },
    ],
  },
  {
    id: "rice-breads",
    label: "Rice & Breads",
    icon: "🍚",
    categories: [
      {
        title: "Pulao & Rice",
        items: [
          { name: "Steamed Rice", price: "₹100" },
          { name: "Jeera Rice", price: "₹140" },
          { name: "Ghee Rice", price: "₹160" },
          { name: "Curd Rice", price: "₹180" },
          { name: "XTSY Spl. Dal Khichdi", price: "₹260" },
        ],
      },
      {
        title: "XTSY Dum Biriyani",
        items: [
          { name: "XTSY Veg/Egg Biriyani (Serves 1)", price: "₹260" },
          { name: "XTSY Chicken Biriyani (Serves 1)", price: "₹280" },
          { name: "XTSY Chicken Mandi Biriyani (Half — Serves 2)", price: "₹640" },
          { name: "XTSY Chicken Mandi Biriyani (Full — Serves 4)", price: "₹1280" },
        ],
      },
      {
        title: "Chinese Fried Rice & Noodles (Veg/Chicken/Seafood)",
        items: [
          { name: "Burned Garlic Fried Rice", price: "₹240/₹260/₹320" },
          { name: "Hot Schezwan Fried Rice", price: "₹240/₹260/₹320" },
          { name: "Burned Garlic Hakka Noodles", price: "₹260/₹280/₹340" },
          { name: "Hot Schezwan Hakka Noodles", price: "₹260/₹280/₹340" },
        ],
      },
      {
        title: "Hot Tandoori Breads",
        items: [
          { name: "Tandoori Roti (Plain/Butter)", price: "₹40/₹60" },
          { name: "Laccha Paratha (Plain/Butter)", price: "₹50/₹70" },
          { name: "Naan (Plain/Butter)", price: "₹60/₹80" },
          { name: "Garlic Naan", price: "₹80" },
          { name: "Kulcha (Plain)", price: "₹80" },
          { name: "Onion Kulcha", price: "₹100" },
          { name: "Masala Kulcha", price: "₹120" },
          { name: "Cheese Kulcha", price: "₹140" },
        ],
        note: "Add-ons: extra butter ₹20, extra cheese ₹25.",
      },
    ],
  },
  {
    id: "specials",
    label: "Specials & Desserts",
    icon: "⭐",
    categories: [
      {
        title: "XTSY Hand-Crafted Pastas (Veg/Chicken/Seafood)",
        items: [
          { name: "Alfredo White", price: "₹320/₹340/₹380" },
          { name: "Al Arrabiata Red", price: "₹320/₹340/₹380" },
        ],
      },
      {
        title: "Chopsuey with Love! (Veg/Chicken/Seafood)",
        items: [
          { name: "American Chopsuey", price: "₹280/₹320/₹380" },
          { name: "Chinese Garlic Chopsuey", price: "₹300/₹340/₹400" },
        ],
      },
      {
        title: "Snack Corner",
        items: [
          { name: "French Fries", price: "₹150" },
          { name: "Papad (or) Papad Masala", price: "₹150" },
          { name: "Boiled Eggs (3 Eggs)", price: "₹150" },
          { name: "Butter Bread Toast (3 Pcs)", price: "₹150" },
          { name: "Peri Peri Fries", price: "₹200" },
          { name: "Veg/Chicken/Paneer Pakoda", price: "₹200" },
          { name: "Peri Peri Cheesy Fries", price: "₹250" },
        ],
        note: "Add-ons: peri peri ₹15, onions ₹30, extra peanuts ₹40.",
      },
      {
        title: "Desserts",
        items: [
          { name: "Choice of Ice Cream (Chocolate/Vanilla/Strawberry)", price: "₹160" },
          { name: "Fruit Bowl", price: "₹180" },
          { name: "Fruit Salad", price: "₹180" },
          { name: "Fruit Bowl with Cream", price: "₹240" },
        ],
        note: "Add-ons: choco chips ₹25, choco syrup ₹20, Oreo crunches ₹25, ice cream ₹50.",
      },
    ],
  },
];
