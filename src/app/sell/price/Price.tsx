import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Price({ user }: Props) {
  return <div>Price</div>;
}
