import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Checkout({ user }: Props) {
  return <div>Checkout</div>;
}
