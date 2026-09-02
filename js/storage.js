const KEY = 'naijahomes_v1';

// ================================
// Seed data (10 properties)
// ================================
const seed = [
  {
    id: '1',
    title: 'Modern 3 Bedroom Apartment',
    purpose: 'rent',
    type: 'apartment',
    price: 2500000,
    location: 'Lekki Phase 1, Lagos',
    state: 'Lagos',
    lga: 'Eti-Osa',
    beds: 3,
    baths: 3,
    area: '145 sqm',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    description: 'Bright, modern 3 bedroom apartment in a secure, well-maintained estate with reliable water and power supply, close to shops and the Lekki-Epe expressway.',
    amenities: ['24/7 Security', 'Parking', 'Fitted Kitchen', 'Water Supply']
  },
  {
    id: '2',
    title: 'Executive 4 Bedroom Duplex',
    purpose: 'sale',
    type: 'duplex',
    price: 85000000,
    location: 'GRA, Enugu',
    state: 'Enugu',
    lga: 'Enugu South',
    beds: 4,
    baths: 5,
    area: '310 sqm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Spacious family duplex with modern finishes, generous parking and a quiet residential setting.',
    amenities: ['Fitted Kitchen', 'Borehole', 'Security', 'Boys Quarter']
  },
  {
    id: '3',
    title: 'Affordable 2 Bedroom Flat',
    purpose: 'rent',
    type: 'apartment',
    price: 1200000,
    location: 'Awka, Anambra',
    state: 'Anambra',
    lga: 'Awka South',
    beds: 2,
    baths: 2,
    area: '105 sqm',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    description: 'Clean two-bedroom apartment suitable for a small family or working professionals.',
    amenities: ['Parking', 'Water Supply', 'Tiled Floors', 'Security']
  },
  {
    id: '4',
    title: 'Family Home Near New Haven',
    purpose: 'sale',
    type: 'house',
    price: 42000000,
    location: 'New Haven, Enugu',
    state: 'Enugu',
    lga: 'Enugu North',
    beds: 3,
    baths: 4,
    area: '240 sqm',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    description: 'Comfortable standalone family house in an established neighbourhood with good road access.',
    amenities: ['Compound', 'Parking', 'Borehole', 'Garden']
  },
  {
    id: '5',
    title: 'Luxury 5 Bedroom Residence',
    purpose: 'sale',
    type: 'duplex',
    price: 145000000,
    location: 'Maitama, Abuja',
    state: 'FCT',
    lga: 'Abuja Municipal',
    beds: 5,
    baths: 6,
    area: '520 sqm',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    description: 'High-end residence with elegant interiors, large living spaces and excellent outdoor areas.',
    amenities: ['Swimming Pool', 'Security', 'Cinema Room', 'Boys Quarter']
  },
  {
    id: '6',
    title: 'Serviced 1 Bedroom Apartment',
    purpose: 'rent',
    type: 'apartment',
    price: 3200000,
    location: 'Victoria Island, Lagos',
    state: 'Lagos',
    lga: 'Eti-Osa',
    beds: 1,
    baths: 1,
    area: '75 sqm',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    description: 'Stylish serviced apartment designed for convenience in a central business district.',
    amenities: ['Generator', 'Security', 'Internet', 'Cleaning']
  },
  {
    id: '7',
    title: 'Residential Plot in Growing Area',
    purpose: 'sale',
    type: 'land',
    price: 15000000,
    location: 'Asaba, Delta',
    state: 'Delta',
    lga: 'Oshimili South',
    beds: 0,
    baths: 0,
    area: '600 sqm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    description: 'Residential plot in a developing area, suitable for a private home or future investment.',
    amenities: ['Road Access', 'Residential Area', 'Survey Available']
  },
  {
    id: '8',
    title: 'Cozy 2 Bedroom Bungalow',
    purpose: 'rent',
    type: 'bungalow',
    price: 1800000,
    location: 'Rumuola, Port Harcourt',
    state: 'Rivers',
    lga: 'Obio/Akpor',
    beds: 2,
    baths: 2,
    area: '130 sqm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Quiet, well-fenced bungalow close to the city centre, ideal for a small family or young professional.',
    amenities: ['Fenced Compound', 'Parking', 'Water Supply', 'Security']
  },
  {
    id: '9',
    title: 'Commercial Land Along Expressway',
    purpose: 'sale',
    type: 'land',
    price: 25000000,
    location: 'Iwo Road, Ibadan',
    state: 'Oyo',
    lga: 'Ibadan North-East',
    beds: 0,
    baths: 0,
    area: '900 sqm',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    description: 'Prime commercial plot with strong road frontage, suited to retail, offices, or mixed-use development.',
    amenities: ['Road Access', 'Corner Piece', 'Survey Available']
  },
  {
    id: '10',
    title: 'Furnished 3 Bedroom Flat',
    purpose: 'rent',
    type: 'apartment',
    price: 2000000,
    location: 'Nasarawa GRA, Kano',
    state: 'Kano',
    lga: 'Nasarawa',
    beds: 3,
    baths: 3,
    area: '150 sqm',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    description: 'Fully furnished apartment in a calm, well-maintained neighbourhood with dependable power and water.',
    amenities: ['Furnished', 'Generator', 'Security', 'Parking']
  }
];

// ================================
// Load / Save helpers
// ================================
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Ensure all required keys exist (fallback to seed if missing)
      return {
        properties: data.properties || seed,
        saved: data.saved || [],
        inquiries: data.inquiries || [],
        profile: data.profile || { name: 'Demo User', email: 'demo@naijahomes.local' }
      };
    }
    // First visit – return seed + empty collections
    return {
      properties: seed,
      saved: [],
      inquiries: [],
      profile: { name: 'Demo User', email: 'demo@naijahomes.local' }
    };
  } catch {
    // If JSON is corrupt, reset to default
    return {
      properties: seed,
      saved: [],
      inquiries: [],
      profile: { name: 'Demo User', email: 'demo@naijahomes.local' }
    };
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

// ================================
// Store API – exported
// ================================
export const Store = {

  // Get entire state
  get() {
    return load();
  },

  // Overwrite entire state (use with caution)
  set(data) {
    return save(data);
  },

  // Get all properties
  properties() {
    return load().properties;
  },

  // Get saved IDs
  saved() {
    return load().saved;
  },

  // Toggle a property in saved list
  toggleSaved(id) {
    const data = load();
    const idx = data.saved.indexOf(id);
    if (idx > -1) {
      data.saved.splice(idx, 1);
    } else {
      data.saved.push(id);
    }
    return save(data);
  },

  // Add a new property (pushed to top)
  addProperty(prop) {
    const data = load();
    data.properties.unshift(prop);
    return save(data);
  },

  // Update an existing property by id
  updateProperty(prop) {
    const data = load();
    data.properties = data.properties.map(p => p.id === prop.id ? prop : p);
    return save(data);
  },

  // Delete a property (and remove from saved list)
  deleteProperty(id) {
    const data = load();
    data.properties = data.properties.filter(p => p.id !== id);
    data.saved = data.saved.filter(s => s !== id);
    return save(data);
  },

  // Add an inquiry (pushed to top)
  addInquiry(inquiry) {
    const data = load();
    data.inquiries.unshift(inquiry);
    return save(data);
  },

  // Get user profile
  profile() {
    return load().profile;
  },

  // Set user profile
  setProfile(profile) {
    const data = load();
    data.profile = profile;
    return save(data);
  },

  // Reset everything (clear localStorage)
  reset() {
    localStorage.removeItem(KEY);
  }
};