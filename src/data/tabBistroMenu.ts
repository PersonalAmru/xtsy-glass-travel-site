export interface MenuItem {
  name: string;
  price: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface MenuSection {
  id: string;
  label: string;
  icon: string;
  categories: MenuCategory[];
}

/**
 * TAB Bistro by XTSY — official menu (Flavour. Food. Fusion.)
 * Source of truth: TAB Bistro Menu Fusion (official PDF). Keep in sync with
 * the printed/forest-dining menu. Prices in INR.
 */
export const menuSections: MenuSection[] = [
  {
    id: "beverages",
    label: "Beverages",
    icon: "☕",
    categories: [
      {
        title: "Assam Tea & Coffee",
        items: [
          { name: "Black Tea", price: "₹39" },
          { name: "Red Tea", price: "₹39" },
          { name: "Lemon Honey Tea", price: "₹39" },
          { name: "Milk Chai", price: "₹59" },
          { name: "Espresso", price: "₹69" },
          { name: "Cappuccino", price: "₹99" },
        ],
      },
      {
        title: "Lemonades",
        items: [
          { name: "Fresh Lime (Sweet/Salt)", price: "₹129" },
          { name: "Fresh Lemon Soda (Sweet/Salt)", price: "₹149" },
          { name: "Fresh Lemon Mint", price: "₹169" },
          { name: "Drinking Water 500 ml", price: "₹12" },
          { name: "Drinking Water 1L", price: "₹24" },
        ],
      },
      {
        title: "Mocktails & Mojitos",
        items: [
          { name: "Virgin Mojito", price: "₹149" },
          { name: "Lychee Fruit Mojito", price: "₹169" },
          { name: "Passion Fruit Mojito", price: "₹189" },
          { name: "Green Apple Mojito", price: "₹189" },
          { name: "Oh Kiwi Rita", price: "₹199" },
          { name: "Piña Colada", price: "₹199" },
          { name: "XTSY Blue Lagoon", price: "₹199" },
          { name: "Awesome Shillong", price: "₹229" },
        ],
      },
      {
        title: "Signature Beverages",
        items: [
          { name: "Chocolate Shake", price: "₹189" },
          { name: "Oreo Shake", price: "₹199" },
          { name: "Strawberry Shake", price: "₹199" },
          { name: "Caramel KitKat Shake", price: "₹229" },
          { name: "Cold Coffee", price: "₹229" },
          { name: "Arabian Fruit & Nut Shake", price: "₹289" },
        ],
      },
    ],
  },
  {
    id: "breakfast",
    label: "Breakfast",
    icon: "🍳",
    categories: [
      {
        title: "Breakfast & Bites (8:45 am – 10:45 am)",
        items: [
          { name: "North Indian Poha", price: "₹139" },
          { name: "Aloo Paratha", price: "₹129" },
          { name: "Onion Paratha", price: "₹139" },
          { name: "Masala Omelette", price: "₹139" },
          { name: "Italian Cheese Omelette", price: "₹149" },
          { name: "Mushroom Cheese Omelette", price: "₹169" },
          { name: "Bread Omelette", price: "₹169" },
          { name: "Paneer Paratha", price: "₹169" },
          { name: "Pancake with Maple Syrup", price: "₹179" },
          { name: "Chicken Cheese Omelette", price: "₹189" },
          { name: "Masala Bread Omelette", price: "₹189" },
          { name: "Pancake Sundae with Ice Cream", price: "₹269" },
          { name: "English Breakfast", price: "₹329" },
          { name: "American Breakfast", price: "₹389" },
        ],
      },
      {
        title: "Signature South Indian",
        items: [
          { name: "Kerala Parotta (2 Pcs) with Chicken Gravy", price: "₹199" },
          { name: "Tomato Rasam with Steamed Rice", price: "₹229" },
          { name: "Chicken Rasam with Steamed Rice", price: "₹259" },
          { name: "XTSY Spl. Curd Rice with Chicken 65", price: "₹269" },
          { name: "XTSY Spl. Chicken Ghee Roasted", price: "₹329" },
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
          { name: "Lemon Coriander (Veg)", price: "₹149" },
          { name: "Lemon Coriander (Non Veg)", price: "₹159" },
          { name: "Sweet Corn Soup (Veg)", price: "₹159" },
          { name: "Clear Soup (Non Veg)", price: "₹159" },
          { name: "Sweet Corn Soup (Non Veg)", price: "₹169" },
          { name: "Hot & Sour Soup (Veg)", price: "₹169" },
          { name: "Manchow Soup (Veg)", price: "₹169" },
          { name: "Hot & Sour Soup (Non Veg)", price: "₹179" },
          { name: "Manchow Soup (Non Veg)", price: "₹179" },
          { name: "Cream of Tomato", price: "₹199" },
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
          { name: "Crispy Chicken 65", price: "₹299" },
          { name: "Wings of Heaven (6PC/12PC)", price: "₹349/699" },
          { name: "Drums of Heaven (6PC/12PC)", price: "₹369/739" },
          { name: "Hot Chilli Prawns", price: "₹389" },
          { name: "Prawns Kung Pao", price: "₹389" },
          { name: "Prawns Hot Schezwan", price: "₹389" },
        ],
      },
      {
        title: "Veg Appetizers",
        items: [
          { name: "Paneer Manchurian Dry", price: "₹279" },
          { name: "Paneer Hot Schezwan Dry", price: "₹279" },
          { name: "Paneer Fusion Kung Pao", price: "₹279" },
          { name: "Mushroom Manchurian Dry", price: "₹289" },
          { name: "Mushroom Hot Schezwan Dry", price: "₹289" },
          { name: "Mushroom Kung Pao", price: "₹289" },
        ],
      },
      {
        title: "Tandoori Appetizers",
        items: [
          { name: "Tandoori Malai Broccoli", price: "₹299" },
          { name: "Tandoori Paneer Tikka", price: "₹329" },
          { name: "Tandoori Mushroom Tikka", price: "₹329" },
          { name: "Tandoori Chicken Tikka", price: "₹329" },
          { name: "Tandoori Prawns", price: "₹389" },
          { name: "Tandoori Chicken (Half/Full)", price: "₹399/789" },
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
          { name: "Mixed Vegetable Gravy", price: "₹299" },
          { name: "Matar Mushroom Masala", price: "₹329" },
          { name: "Paneer Butter Masala", price: "₹329" },
          { name: "Paneer Lababdar", price: "₹329" },
          { name: "Kadhai Paneer", price: "₹329" },
        ],
      },
      {
        title: "Indian Gravies — Non Veg",
        items: [
          { name: "Chicken Curry", price: "₹299" },
          { name: "Chicken Butter Masala", price: "₹329" },
          { name: "Chicken Tikka Masala", price: "₹329" },
          { name: "Kadhai Chicken", price: "₹329" },
          { name: "XTSY Chicken Kosha", price: "₹329" },
        ],
      },
      {
        title: "Dal Specials",
        items: [
          { name: "Yellow Dal Tadka", price: "₹269" },
          { name: "XTSY Spl. Dal Makhani", price: "₹299" },
        ],
      },
      {
        title: "Chinese Gravy — Veg",
        items: [
          { name: "Veg Manchurian Gravy", price: "₹279" },
          { name: "Veg Schezwan Gravy", price: "₹279" },
          { name: "Paneer Chilli Gravy", price: "₹299" },
          { name: "Paneer Manchurian Gravy", price: "₹329" },
          { name: "Mushroom Chilli Gravy", price: "₹329" },
          { name: "Mushroom Manchurian Gravy", price: "₹349" },
        ],
      },
      {
        title: "Chinese Gravy — Non Veg",
        items: [
          { name: "Chilli Chicken Gravy", price: "₹329" },
          { name: "Chicken Schezwan Gravy", price: "₹329" },
          { name: "Chicken Manchurian Gravy", price: "₹349" },
          { name: "Chicken Cheese Manchurian Gravy", price: "₹369" },
          { name: "Honey Chilli Chicken Gravy", price: "₹389" },
          { name: "Chef's Special Chicken Gravy", price: "₹389" },
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
          { name: "Steamed Rice", price: "₹99" },
          { name: "Jeera Rice", price: "₹139" },
          { name: "Ghee Rice", price: "₹169" },
          { name: "Veg Pulao", price: "₹199" },
          { name: "XTSY Spl. Dal Khichdi", price: "₹259" },
        ],
      },
      {
        title: "XTSY Dum Biriyani",
        items: [
          { name: "XTSY Egg Biriyani", price: "₹299" },
          { name: "XTSY Chicken Biriyani", price: "₹329" },
          { name: "XTSY Chicken Mandi Biriyani (Half — Serves 2)", price: "₹639" },
          { name: "XTSY Chicken Mandi Biriyani (Full — Serves 4)", price: "₹1229" },
        ],
      },
      {
        title: "Chinese Fried Rice & Noodles (Veg/Chicken/Seafood)",
        items: [
          { name: "Burned Garlic Fried Rice", price: "₹249/289/339" },
          { name: "Hot Schezwan Fried Rice", price: "₹249/289/339" },
          { name: "Burned Garlic Hakka Noodles", price: "₹259/299/349" },
          { name: "Hot Schezwan Hakka Noodles", price: "₹259/299/349" },
        ],
      },
      {
        title: "Hot Tandoori Breads",
        items: [
          { name: "Tandoori Roti (Plain/Butter)", price: "₹39/49" },
          { name: "Laccha Paratha (Plain/Butter)", price: "₹49/59" },
          { name: "Naan (Plain/Butter)", price: "₹59/69" },
          { name: "Garlic Naan", price: "₹69" },
          { name: "Kulcha (Plain)", price: "₹89" },
          { name: "Onion Kulcha", price: "₹99" },
          { name: "Masala Kulcha", price: "₹129" },
          { name: "Cheese Kulcha", price: "₹139" },
        ],
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
          { name: "Alfredo White", price: "₹329/349/389" },
          { name: "Al Arrabiata Red", price: "₹329/349/389" },
        ],
      },
      {
        title: "Chopsuey with Love! (Veg/Chicken/Seafood)",
        items: [
          { name: "American Chopsuey", price: "₹289/329/379" },
          { name: "Chinese Garlic Chopsuey", price: "₹299/349/399" },
        ],
      },
      {
        title: "Snack Corner",
        items: [
          { name: "French Fries", price: "₹149" },
          { name: "Papad Masala", price: "₹159" },
          { name: "Peanut Masala", price: "₹169" },
          { name: "Peri Peri Fries", price: "₹179" },
        ],
      },
      {
        title: "Desserts",
        items: [
          { name: "Ice Cream (Chocolate/Vanilla/Strawberry)", price: "₹149" },
          { name: "Fruit Bowl", price: "₹159" },
          { name: "Fruit Bowl with Cream", price: "₹189" },
          { name: "Fruit Salad", price: "₹189" },
          { name: "Hot Brownie", price: "₹229" },
          { name: "Hot Brownie with Ice Cream", price: "₹259" },
          { name: "XTSY Spl. Classic Kunafa", price: "₹349" },
          { name: "XTSY Spl. Classic Cream Kunafa", price: "₹389" },
        ],
      },
    ],
  },
];
