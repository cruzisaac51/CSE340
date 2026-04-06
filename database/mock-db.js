const classifications = [
  { classification_id: 1, classification_name: "Sedan" },
  { classification_id: 2, classification_name: "SUV" },
  { classification_id: 3, classification_name: "Sports" }
];

const inventory = [
  { 
    inv_id: 1, 
    inv_make: "Honda", 
    inv_model: "Civic", 
    inv_description: "A highly reliable and compact sedan for city driving and daily use.", 
    inv_image: "/images/vehicles/no-image.png", 
    inv_thumbnail: "/images/vehicles/no-image-tn.png", 
    inv_price: 25000, 
    inv_year: 2024, 
    inv_miles: 15, 
    inv_color: "Blue", 
    classification_id: 1 
  },
  { 
    inv_id: 2, 
    inv_make: "Ford", 
    inv_model: "Explorer", 
    inv_description: "A spacious SUV perfect for family trips and heavy duty loads.", 
    inv_image: "/images/vehicles/no-image.png", 
    inv_thumbnail: "/images/vehicles/no-image-tn.png", 
    inv_price: 45000, 
    inv_year: 2023, 
    inv_miles: 15000, 
    inv_color: "Black", 
    classification_id: 2 
  },
  { 
    inv_id: 3, 
    inv_make: "Porsche", 
    inv_model: "911", 
    inv_description: "A ridiculously fast sports car with premium finishings.", 
    inv_image: "/images/vehicles/no-image.png", 
    inv_thumbnail: "/images/vehicles/no-image-tn.png", 
    inv_price: 110000, 
    inv_year: 2024, 
    inv_miles: 50, 
    inv_color: "Red", 
    classification_id: 3 
  }
];

const parts = [
  { part_id: 1, part_name: "Flux Capacitor", part_price: 500000.00, part_image: "/images/upgrades/flux-cap.png" },
  { part_id: 2, part_name: "Flame Decals", part_price: 50.00, part_image: "/images/upgrades/flame.jpg" },
  { part_id: 3, part_name: "Bumper Stickers", part_price: 5.00, part_image: "/images/upgrades/bumper_sticker.jpg" },
  { part_id: 4, part_name: "Hub Caps", part_price: 150.00, part_image: "/images/upgrades/hub-cap.jpg" }
];

// Este hash equivale a "password" usando bcrypt
const dummyHash = "$2a$10$rJ/g85.kG/Hn2tIuTqZ.M.QhxO.Hh1YvLw3M20d8N8U4p6hBf3hZC"; 

const accounts = [
  {
    account_id: 1,
    account_firstname: "Mock",
    account_lastname: "Admin",
    account_email: "admin@mock.com",
    account_password: dummyHash,
    account_type: "Admin"
  }
];

module.exports = {
  async query(text, params) {
    console.log("\n[MOCK DB] Executed fake query intercept:", { text, params });
    
    // Simulate: Get all parts
    if (text.includes("FROM public.part")) {
      let resultParts = [...parts];
      if (text.includes("ORDER BY part_price DESC")) {
        resultParts.sort((a, b) => b.part_price - a.part_price);
      } else if (text.includes("ORDER BY part_price ASC")) {
        resultParts.sort((a, b) => a.part_price - b.part_price);
      }
      return { rows: resultParts, rowCount: resultParts.length };
    }
    
    // Simulate: Get all classifications
    if (text.includes("FROM public.classification ORDER BY classification_name") || text.includes("FROM public.classification")) {
      return { rows: classifications, rowCount: classifications.length };
    }
    
    // Simulate: Get inventory by classification ID
    if (text.includes("i.classification_id = $1")) {
      const cls_id = params[0];
      const items = inventory.filter(i => i.classification_id == cls_id);
      const joined = items.map(item => {
        const cls = classifications.find(c => c.classification_id === item.classification_id);
        return { ...item, classification_name: cls ? cls.classification_name : "Unknown" };
      });
      return { rows: joined, rowCount: joined.length };
    }

    // Simulate: Get inventory by ID
    if (text.includes("i.inv_id IN") || text.includes("inv_id = $1")) {
      const id = params[0];
      const items = inventory.filter(i => i.inv_id == id);
      const joined = items.map(item => {
        const cls = classifications.find(c => c.classification_id === item.classification_id);
        return { ...item, classification_name: cls ? cls.classification_name : "Unknown" };
      });
      return { rows: joined, rowCount: joined.length };
    }
    
    // Simulate: Account / Login check
    if (text.includes("FROM account WHERE account_email = $1") || text.includes("FROM public.account  where account_email= $1")) {
      const email = params[0];
      const account = accounts.find(a => a.account_email === email);
      if (account) {
          return { rows: [account], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // Fallback genérico para no explotar promesas pendientes
    return { rows: [], rowCount: 0 };
  }
};
