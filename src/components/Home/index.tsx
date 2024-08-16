import { HomeType } from "@/lib/validations";

interface Props {
  home: HomeType;
}

export default function Home({ home }: Props) {
  const title = home.title;
  const description = home.description;
  const price = home.price;

  return (
    <div className="flex flex-col w-full h-full justify-center">
      <div>Hello there!</div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{price}</div>
    </div>
  );
}
