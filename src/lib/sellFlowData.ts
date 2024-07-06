export const sellSteps = [
  ["/sell/categories", "/sell/rooms", "/sell/capacity"],
  ["/sell/features", "/sell/photos", "/sell/title", "/sell/description"],
  ["/sell/contact", "/sell/price", "/sell/checkout", "/sell/review"],
];

export const totalLengthOfAllSteps = sellSteps.reduce((acc, step) => acc + step.length, 0);
export const stepLengths = sellSteps.map((step) => step.length);
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
  console.log("outerIndex", outerIndex, "innerIndex", innerIndex);
  if (outerIndex === -1 || innerIndex === -1) {
    return { array: Array(sellSteps.length).fill(0), outerIndex: 0, innerIndex: 0 };
  }
  const currentArrayPercent = ((innerIndex + 1) / sellSteps[outerIndex].length) * 100;

  const array = Array(sellSteps.length).fill(0);
  for (let i = 0; i < outerIndex; i++) {
    array[i] = 100;
  }
  array[outerIndex] = currentArrayPercent;

  return { array, outerIndex, innerIndex };
};
