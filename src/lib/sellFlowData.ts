export const sellSteps = [
  ["step1", "type", "location", "rooms", "capacity"],
  ["step2", "features", "photos", "title", "description"],
  ["step3", "contact", "price", "checkout", "review"],
];

export const types = [
  "House", //X House
  "Apartment" /* */,
  "Cabin" /* */,
  "Country house", //
  "Castle", //X Castle
  "Commercial building", //X City or Domain
  "Container", // container
  "Cycladic home", //
  "Eco home", // Home eco from Tabler
  "Farm", // argriculture
  "Houseboat", //X Houseboat
  "Land", //landscape or Forest
  "Mansion", // Fort
  "Tiny home", // Cottage?
  "Tower", //Tower from tabler
  "Warehouse", //Warehouse Tabler icons
  "Windmill", //Windmill tabler
];

export const features = [
  "None",
  "Air-conditioning", // Air vent lucide
  "Attic", // Lamp Ceiling lucide
  "Balcony", // Balcony MUI
  "Basement", // Dungeon Font Awesome?
  "BBQ" /* */,
  "Beach access" /* */,
  "Car parking", // Parking Lucide
  "Elevator", // Elevator Tabler
  "Exercise Equipment", // Dumbbell lucide
  "Fire Pit", // Flame kindling lucide
  "Garage", // Car Garage Tabler
  "Garden/Yard", // Sprout lucide
  "Heating system", // Heater lucide
  "Home office", // office chair phosphor
  "Hot Tub", // Hot tub MUI
  "Indoor Fireplace", // Fireplace either mui or google
  "Lake access", // fishing-rod font awesome
  "Laundry room", // washing machine lucide
  "Outdoor Dining Area", // maybe park phosphor
  "Patio", // patio heater
  "Pool", // pool MUI
  "Security system", // cctv lucide
  "Ski-in/Ski-out", // person skiing font awesome
  "Solar panels", // solar panel tabler
  "Terrace", // Deck google
  "Walk-in closet", // Hanger Tabler
];

export const roomStylesMap = [
  { id: "modern", name: "Modern" },
  { id: "vintage", name: "Vintage" },
  { id: "minimalist", name: "Minimalist" },
  { id: "industrial", name: "Industrial" },
  { id: "bohemian", name: "Bohemian" },
  { id: "scandinavian", name: "Scandinavian" },
  { id: "coastal", name: "Coastal" },
  { id: "mediterranean", name: "Mediterranean" },
  { id: "farmhouse", name: "Farmhouse" },
  { id: "mid-century-modern", name: "Mid-Century Modern" },
];

export const propertyStylesMap = [
  { id: "contemporary", name: "Contemporary" },
  { id: "colonial", name: "Colonial" },
  { id: "victorian", name: "Victorian" },
  { id: "craftsman", name: "Craftsman" },
  { id: "mediterranean-revival", name: "Mediterranean Revival" },
  { id: "cape-cod", name: "Cape Cod" },
  { id: "tudor", name: "Tudor" },
  { id: "art-deco", name: "Art Deco" },
  { id: "ranch", name: "Ranch" },
  { id: "chalet", name: "Chalet" },
];

export const roomTypesMap = [
  { id: "bedroom", name: "Bedroom" },
  { id: "kitchen", name: "Kitchen" },
  { id: "living-room", name: "Living room" },
  { id: "bathroom", name: "Bathroom" },
  { id: "study", name: "Study" },
  { id: "dining-room", name: "Dining room" },
];

export const typesMap = [
  { id: "house", name: "House" },
  { id: "apartment", name: "Apartment" },
  { id: "cabin", name: "Cabin" },
  { id: "country-house", name: "Country House" },
  { id: "castle", name: "Castle" },
  { id: "commercial-building", name: "Commercial building" },
  { id: "container", name: "Container" },
  { id: "cycladic-home", name: "Cycladic home" },
  { id: "eco-home", name: "Eco home" },
  { id: "farm", name: "Farm" },
  { id: "houseboat", name: "Houseboat" },
  { id: "land", name: "Land" },
  { id: "mansion", name: "Mansion" },
  { id: "tiny-home", name: "Tiny home" },
  { id: "tower", name: "Tower" },
  { id: "warehouse", name: "Warehouse" },
  { id: "windmill", name: "Windmill" },
];

export const featuresMap = [
  { id: "none", name: "None" },
  { id: "air-conditioning", name: "Air-conditioning" },
  { id: "attic", name: "Attic" },
  { id: "balcony", name: "Balcony" },
  { id: "basement", name: "Basement" },
  { id: "bbq", name: "BBQ" },
  { id: "beach-access", name: "Beach access" }, // done
  { id: "car-parking", name: "Car parking" },
  { id: "elevator", name: "Elevator" },
  { id: "exercise-equipment", name: "Exercise Equipment" },
  { id: "fire-pit", name: "Fire Pit" },
  { id: "garage", name: "Garage" },
  { id: "garden-yard", name: "Garden / Yard" },
  { id: "heating-system", name: "Heating system" },
  { id: "home-office", name: "Home office" },
  { id: "hot-tub", name: "Hot Tub" },
  { id: "indoor-fireplace", name: "Indoor Fireplace" },
  { id: "lake-access", name: "Lake access" },
  { id: "laundry-room", name: "Laundry room" },
  { id: "outdoor-dining-area", name: "Outdoor Dining Area" },
  { id: "patio", name: "Patio" },
  { id: "pool", name: "Pool" },
  { id: "security-system", name: "Security system" },
  { id: "ski-in-ski-out", name: "Ski-in / Ski-out" },
  { id: "solar-panels", name: "Solar panels" },
  { id: "terrace", name: "Terrace" },
  { id: "walk-in-closet", name: "Walk-in closet" },
];

export const rooms = ["Bedrooms", "Bathrooms", "Living rooms", "Kitchens"];

export const listingType = ["standard", "premium"];

export const totalLengthOfAllSteps = sellSteps.reduce((acc, step) => acc + step.length, 0);
export const stepLengths = sellSteps.map((step) => step.length);
export const stepLengthsWithoutStepPages = stepLengths.map((step) => step - 1);
export const stepsFlattened = sellSteps.flat();

export const getSellFlowIndex = (string: string) => {
  return stepsFlattened.findIndex((step) => step === string);
};

export const locateSellFlowArrayIndices = (string: string) => {
  for (let outerIndex = 0; outerIndex < sellSteps.length; outerIndex++) {
    const innerIndex = sellSteps[outerIndex].indexOf(string);
    if (innerIndex !== -1) {
      return { outerIndex, innerIndex };
    }
  }
  return { outerIndex: -1, innerIndex: -1 }; // Not found
};

export const getStepData = (string: string) => {
  const { outerIndex, innerIndex } = locateSellFlowArrayIndices(string);

  if (outerIndex === -1 || innerIndex === -1) {
    return { array: Array(sellSteps.length).fill(0), outerIndex: 0, innerIndex: 0 };
  }

  if (innerIndex === 0) {
    const resultArray = Array(sellSteps.length).fill(0);
    for (let i = 0; i < outerIndex; i++) {
      resultArray[i] = 100;
    }
    return { array: resultArray, outerIndex: outerIndex, innerIndex: innerIndex };
  }

  const currentArrayPercent = (innerIndex / (sellSteps[outerIndex].length - 1)) * 100;

  const array = Array(sellSteps.length).fill(0);
  for (let i = 0; i < outerIndex; i++) {
    array[i] = 100;
  }
  array[outerIndex] = currentArrayPercent;

  return { array, outerIndex, innerIndex };
};
