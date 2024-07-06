import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Capacity({ user }: Props) {
  return <div>Capacity</div>;
}
