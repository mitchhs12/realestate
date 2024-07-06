import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Categories({ user }: Props) {
  return <div>Categories</div>;
}
