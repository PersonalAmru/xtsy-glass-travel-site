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
          { name: "Lemon Tea", price: "₹59" },
          { name: "Green Tea", price: "₹69" },
          { name: "Masala Tea", price: "₹79" },
          { name: "Honey Tea", price: "₹89" },
          { name: "Cappuccino", price: "₹129" },
          { name: "Café Latte", price: "₹129" },
          { name: "Espresso", price: "₹129" },
        ],
      },
      {
        title: "Lemonades",
        items: [
          { name: "Fresh Lime Soda", price: "₹139" },
          { name: "Mint Lemonade", price: "₹159" },
          { name: "Peach Lemonade", price: "₹130" },
          { name: "Watermelon Lemonade", price: "₹189" },
          { name: "Ginger Lime Cooler", price: "₹199" },
        ],
      },
      {
        title: "Mocktails & Mojitos",
        items: [
          { name: "Virgin Mojito", price: "₹189" },
          { name: "Lychee Fruit Mojito", price: "₹189" },
          { name: "Passion Fruit Mojito", price: "₹189" },
          { name: "Piña Colada", price: "₹189" },
          { name: "Green Apple Mojito", price: "₹189" },
          { name: "Awesome Shillong", price: "₹189" },
          { name: "Pink Lady", price: "₹229" },
          { name: "Oh Kiwi Rita", price: "₹229" },
          { name: "Bob Marley", price: "₹229" },
          { name: "Sunrise in Meghalaya", price: "₹229" },
          { name: "Bartender's Special", price: "₹239" },
          { name: "Blue Lagoon", price: "₹239" },
        ],
      },
      {
        title: "Shakes & Smoothies",
        items: [
          { name: "Cold Coffee", price: "₹199" },
          { name: "Mango Smoothie", price: "₹229" },
          { name: "Strawberry Smoothie", price: "₹229" },
          { name: "Caramel Frappe", price: "₹229" },
          { name: "Chocolate Shake", price: "₹239" },
          { name: "Oreo Frappe", price: "₹239" },
        ],
      },
    ],
  },
  {
    id: "starters",
    label: "Starters",
    icon: "🍢",
    categories: [
      {
        title: "Soups",
        items: [
          { name: "Lemon Coriander (Veg/Non Veg)", price: "₹169" },
          { name: "Sweet Corn Soup (Veg/Non Veg)", price: "₹169" },
          { name: "Hot & Sour Soup (Veg/Non Veg)", price: "₹169" },
          { name: "Manchow Soup (Veg/Non Veg)", price: "₹169" },
          { name: "Chicken Hot & Sour", price: "₹189" },
          { name: "Cream of Tomato", price: "₹219" },
          { name: "Wild Mushroom Soup", price: "₹239" },
        ],
      },
      {
        title: "Mini Bites & Salads",
        items: [
          { name: "Garlic Bread", price: "₹109" },
          { name: "Cheese Garlic Bread", price: "₹139" },
          { name: "Bread Omelette", price: "₹189" },
          { name: "Farm Fresh Sandwich", price: "₹199" },
          { name: "Paneer/Chicken Pakoda", price: "₹239" },
          { name: "Spanish Omelette", price: "₹239" },
          { name: "Italian Cheese Omelette", price: "₹249" },
          { name: "Chicken Club Sandwich", price: "₹249" },
          { name: "Chicken Tikka Sandwich", price: "₹259" },
          { name: "XTSY Loaded (Veg/Non Veg)", price: "₹289" },
          { name: "Stupid Nachos Veg", price: "₹299" },
          { name: "Stupid Nachos Non Veg", price: "₹369" },
          { name: "XTSY Caesar (Veg/Non Veg)", price: "₹369" },
        ],
      },
      {
        title: "Signature Starters",
        items: [
          { name: "Smoked Chicken Honey Chilli", price: "₹389" },
          { name: "Dragon Chicken", price: "₹389" },
          { name: "Lat Mei Kai", price: "₹389" },
          { name: "Chilli Garlic Chicken", price: "₹389" },
          { name: "Pepper Salt Chicken", price: "₹389" },
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
          { name: "Crispy Chicken", price: "₹289" },
          { name: "Chicken Manchurian", price: "₹369" },
          { name: "Chicken Schezwan", price: "₹369" },
          { name: "Bangkok Chicken Fusion", price: "₹369" },
          { name: "Chicken Pepper Dry", price: "₹369" },
          { name: "Drums of Heaven [6PC]", price: "₹369" },
          { name: "Drums of Heaven [12PC]", price: "₹729" },
          { name: "Wings of Heaven [6PC]", price: "₹389" },
          { name: "Wings of Heaven [12PC]", price: "₹769" },
          { name: "Prawns Manchurian", price: "₹429" },
          { name: "Prawns Sweet & Spice", price: "₹429" },
          { name: "Dry Fish Chilli", price: "₹429" },
          { name: "Bangkok Prawns Fusion", price: "₹469" },
        ],
      },
      {
        title: "Veg Appetizers",
        items: [
          { name: "Baby Corn Sweet & Chilli", price: "₹269" },
          { name: "Baby Corn Manchurian", price: "₹269" },
          { name: "American Corn Fusion", price: "₹299" },
          { name: "Baby Corn Salt & Pepper Dry", price: "₹369" },
          { name: "Paneer Sweet & Chilli", price: "₹369" },
          { name: "Paneer Manchurian", price: "₹369" },
          { name: "Paneer Chilli", price: "₹369" },
          { name: "Paneer Kung Pao", price: "₹349" },
          { name: "Bangkok Paneer Fusion", price: "₹369" },
          { name: "Mushroom Sweet & Spice", price: "₹369" },
          { name: "Mushroom Chilli", price: "₹369" },
          { name: "Bangkok Mushroom Fusion", price: "₹389" },
        ],
      },
    ],
  },
  {
    id: "tandoor",
    label: "Tandoor & Grill",
    icon: "🔥",
    categories: [
      {
        title: "From the Clay — Veg",
        items: [
          { name: "Chatpata Paneer Tikka", price: "₹369" },
          { name: "Paneer Malai Tikka", price: "₹369" },
          { name: "Tandoori Mushroom Tikka", price: "₹399" },
        ],
      },
      {
        title: "From the Clay — Non Veg",
        items: [
          { name: "Murgh Malai Tikka", price: "₹369" },
          { name: "Murgh Lahsooni Tikka", price: "₹389" },
          { name: "Chicken Seekh Kebab", price: "₹389" },
          { name: "Tandoori Chicken [Half]", price: "₹389" },
          { name: "Tandoori Chicken [Full]", price: "₹799" },
          { name: "Afghani Chicken [Half]", price: "₹429" },
          { name: "Afghani Chicken [Full]", price: "₹889" },
        ],
      },
      {
        title: "From the Oven — Seafood",
        items: [
          { name: "Malai Fish Tikka", price: "₹429" },
          { name: "Tandoori Fish Tikka", price: "₹429" },
          { name: "Tandoori Prawns", price: "₹489" },
        ],
      },
      {
        title: "On The Plates",
        items: [
          { name: "The Classic Fish N Chips", price: "₹429" },
          { name: "Chicken Stroganoff", price: "₹429" },
          { name: "Lemon Thyme Grilled Prawns", price: "₹429" },
          { name: "Grilled Chicken", price: "₹449" },
          { name: "Chicken Schnitzel", price: "₹449" },
          { name: "Grilled Fish Lemon Butter Sauce", price: "₹469" },
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
          { name: "Spl. Mix Vegetable", price: "₹299" },
          { name: "Paneer Butter Masala", price: "₹369" },
          { name: "Matar Mushroom Masala", price: "₹349" },
          { name: "Meethi Malai Paneer", price: "₹349" },
          { name: "Paneer Lababdar", price: "₹349" },
          { name: "Kadhai Paneer", price: "₹389" },
        ],
      },
      {
        title: "Indian Gravies — Non Veg",
        items: [
          { name: "Tandoori Chicken Butter Masala [4 pcs]", price: "₹369" },
          { name: "Chicken Bharta Boneless", price: "₹369" },
          { name: "Kadhai Chicken", price: "₹389" },
          { name: "Murgh E Lababdar Chicken", price: "₹399" },
          { name: "Chicken Tikka Masala Boneless [6 pcs]", price: "₹429" },
          { name: "Chicken Gosht", price: "₹429" },
          { name: "Chicken Roganjosh", price: "₹429" },
        ],
      },
      {
        title: "Dal Specials",
        items: [
          { name: "Yellow Dal Tadka", price: "₹289" },
          { name: "XTSY Special Dal Makhani", price: "₹369" },
        ],
      },
      {
        title: "Chinese Gravies — Veg",
        items: [
          { name: "Veg Manchurian Gravy", price: "₹269" },
          { name: "Cheese Butter Garlic Gravy", price: "₹289" },
          { name: "Paneer Chilli Gravy", price: "₹289" },
        ],
      },
      {
        title: "Chinese Gravies — Non Veg",
        items: [
          { name: "Chilli Chicken", price: "₹369" },
          { name: "Chicken Manchurian", price: "₹369" },
          { name: "Chicken Kung Pao", price: "₹349" },
          { name: "Garlic Chicken", price: "₹369" },
          { name: "Saucy Shredded Chicken", price: "₹399" },
        ],
      },
      {
        title: "Thai Dishes",
        items: [
          { name: "Thai Basil Paneer", price: "₹389" },
          { name: "Thai Lemon Chilli Paneer", price: "₹389" },
          { name: "Thai Basil Chicken Dry", price: "₹389" },
          { name: "Thai Veg Curry", price: "₹389" },
          { name: "Sliced Chicken Curry", price: "₹429" },
        ],
      },
      {
        title: "Indo-Chinese Seafoods",
        items: [
          { name: "Chilli Fish Gravy", price: "₹429" },
          { name: "Butter Garlic Prawns Dry", price: "₹489" },
          { name: "Chilli Prawns Gravy", price: "₹489" },
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
          { name: "Steamed Rice", price: "₹129" },
          { name: "Jeera Rice", price: "₹139" },
          { name: "Ghee Rice", price: "₹189" },
          { name: "Veg Pulao", price: "₹189" },
          { name: "Kashmiri Pulao", price: "₹239" },
          { name: "Chicken Pulao", price: "₹249" },
        ],
      },
      {
        title: "Chinese Fried Rice & Noodles",
        items: [
          { name: "Burned Garlic Hakka Noodles (V/C/S)", price: "₹249/299/369" },
          { name: "Schezwan Hakka Noodles (V/C/S)", price: "₹249/299/369" },
          { name: "Burned Garlic Fried Rice (V/C/S)", price: "₹249/299/369" },
          { name: "Schezwan Fried Rice (V/C/S)", price: "₹249/299/369" },
        ],
      },
      {
        title: "Tandoori Breads",
        items: [
          { name: "Roti (Plain/Butter)", price: "₹29/39" },
          { name: "Laccha Paratha (Plain/Butter)", price: "₹49/59" },
          { name: "Naan (Plain/Butter)", price: "₹49/59" },
          { name: "Garlic Naan", price: "₹69" },
          { name: "Kulcha (Plain)", price: "₹69" },
          { name: "Onion Kulcha", price: "₹89" },
          { name: "Cheese Garlic Naan", price: "₹99" },
          { name: "Masala Kulcha", price: "₹129" },
          { name: "Cheese Kulcha", price: "₹169" },
        ],
      },
    ],
  },
  {
    id: "specials",
    label: "Specials",
    icon: "⭐",
    categories: [
      {
        title: "Pastas",
        items: [
          { name: "Alfredo (Veg/Chicken/Seafood)", price: "₹349/369/399" },
          { name: "Al Arrabiata (Veg/Chicken/Seafood)", price: "₹349/369/399" },
        ],
      },
      {
        title: "Chopsuey",
        items: [
          { name: "American Chopsuey (V/C/S)", price: "₹289/329/399" },
          { name: "Chinese Chopsuey (V/C/S)", price: "₹289/329/399" },
          { name: "Schezwan Chopsuey (V/C/S)", price: "₹289/329/399" },
        ],
      },
      {
        title: "Sizzlers",
        items: [
          { name: "Vegetable Tikki Sizzler", price: "₹399" },
          { name: "Paneer Shaslik Sizzler", price: "₹429" },
          { name: "Grilled Chicken Steak Sizzler", price: "₹469" },
        ],
      },
      {
        title: "Pizzas",
        items: [
          { name: "Margarita Pizza", price: "₹369" },
          { name: "Farm Fresh Pizza (Veg/Non Veg)", price: "₹389" },
          { name: "BBQ Paneer Tikka Pizza", price: "₹399" },
          { name: "BBQ Chicken Tikka Pizza", price: "₹399" },
          { name: "XTSY Heaven (Veg/Non Veg)", price: "₹449" },
        ],
      },
      {
        title: "Desserts",
        items: [
          { name: "Ice Cream (Chocolate/Vanilla/Strawberry)", price: "₹129" },
          { name: "Pancake with Maple Syrup", price: "₹189" },
          { name: "Hot Fudge Brownie with Ice Cream", price: "₹229" },
        ],
      },
    ],
  },
];
