import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

interface Props {
  state: number;
  setState: (value: number) => void;
}

export default function CounterComponent({ state, setState }: Props) {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setState(state > 0 ? state - 1 : 0);
        }}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <div className="w-4">{state}</div>
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
