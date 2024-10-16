import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { formatNumber } from "@/lib/utils";

interface Props {
  state: number;
  setState: (value: number) => void;
  numerals: string;
}

export default function CounterComponent({ state, setState, numerals }: Props) {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setState(state >= 0 ? state - 1 : 0);
        }}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <div className="w-4">{formatNumber(state, numerals)}</div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setState(state + 1);
        }}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </>
  );
}
