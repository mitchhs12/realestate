export const sellSteps = [
  ["/sell/step1", "/sell/type", "/sell/location", "/sell/rooms", "/sell/capacity"],
  ["/sell/step2", "/sell/features", "/sell/photos", "/sell/title", "/sell/description"],
  ["/sell/step3", "/sell/contact", "/sell/price", "/sell/checkout", "/sell/review"],
];

export const types = [
  "House",
  "Apartment",
  "Cabin",
  "Casa particular",
  "Castle",
  "Commercial building",
  "Container",
  "Cycladic home",
  "Earth home",
  "Farm",
  "Houseboat",
  "Land",
  "Mansion",
  "Tiny home",
  "Tower",
  "Warehouse",
  "Windmill",
];

export const features = [
  "None",
  "Air-conditioning",
  "Attic",
  "Balcony",
  "Basement",
  "BBQ",
  "Beach access",
  "Car parking",
  "Exercise Equipment",
  "Fire Pit",
  "Garage",
  "Garden/Yard",
  "Heating system",
  "Home office",
  "Hot Tub",
  "Indoor Fireplace",
  "Lake access",
  "Laundry room",
  "Outdoor Dining Area",
  "Patio",
  "Pool",
  "Security system",
  "Ski-in/Ski-out",
  "Solar panels",
  "Terrace",
  "Walk-in closet",
];

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
