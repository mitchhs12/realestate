import { User } from "next-auth";

interface Props {
  user: User;
}

export default function Description({ user }: Props) {
  return <div>Description</div>;
}
