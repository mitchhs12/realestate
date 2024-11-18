import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

export const CompareSlider = ({ original, restored }: { original: string; restored: string }) => {
  console.log("original", original);
  console.log("restored", restored);
  return (
    <ReactCompareSlider
      itemOne={<ReactCompareSliderImage src={original} alt="original photo" />}
      itemTwo={<ReactCompareSliderImage src={restored} alt="generated photo" />}
      portrait={false}
      className="flex w-full h-full"
    />
  );
};
