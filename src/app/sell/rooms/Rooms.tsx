import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Rooms({ user }: Props) {
  return <div>Rooms</div>;
}
