import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ContentArray {
  title: string;
  description: string;
}

interface Props {
  perks: ContentArray[];
  title: string;
  description: string;
  button: string;
  buttonDisabled: boolean;
  originalPrice?: string;
  buttonFunction: () => void;
  selected: "Standard" | "Premium" | null;
}

export default function CheckoutCard({
  perks,
  title,
  description,
  button,
  buttonDisabled,
  originalPrice,
  buttonFunction,
  selected,
}: Props) {
  return (
    <div className={`flex justify-center items-center ${selected === title && "border border-primary rounded-lg"}`}>
      <Card className="w-[350px] md:[400px] h-[440px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-center items-center text-bold">{title}</CardTitle>
          <CardDescription className="flex justify-center items-center text-light">{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 flex-grow">
          {perks.map((perk, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
              <div className="flex flex-col justify-start space-y-1 text-start">
                <p className="flex justify-start text-md font-medium leading-none">{perk.title}</p>
                <p className="flex justify-start text-sm text-muted-foreground">{perk.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-center h-[90px] justify-end">
          {originalPrice && (
            <span className="text-md text-muted-foreground line-through">{originalPrice} per month</span>
          )}
          <Button variant={"default"} className="w-full text-lg" disabled={buttonDisabled} onClick={buttonFunction}>
            {button}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
